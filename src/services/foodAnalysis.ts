import { API_CONFIG, SCORING_CRITERIA } from './config';
import { FoodItem } from '../data/types';

interface AnalysisResult {
  success: boolean;
  foods: FoodItem[];
  error?: string;
  errorType?: 'network' | 'api' | 'parse' | 'unknown';
}

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// System prompt for food analysis
const ANALYSIS_PROMPT = `You are a nutrition analyst for the Mido app, which focuses on supporting the Enteric Nervous System (ENS) - the "second brain" in the gut.

Analyze the food in this image and return a JSON array of detected food items. For each item, provide:
- name: The food name
- portionSize: Estimated portion (e.g., "6 oz", "1 cup", "2 tbsp")
- score: A score from 1-3 based on how well this food supports ENS health:
  - Score 3: Excellent for ENS (omega-3 rich fish, leafy greens, fermented foods, healthy fats like olive oil/avocado, anti-inflammatory spices)
  - Score 2: Good/Neutral for ENS (quality proteins, whole foods, vegetables, fruits)
  - Score 1: May stress ENS (processed foods, refined sugars, seed oils, fried foods)
- warnings: Array of any concerns (e.g., ["Contains gluten", "Highly processed"])

IMPORTANT: Return ONLY valid JSON in this exact format, no other text:
[
  {"name": "Food Name", "portionSize": "portion", "score": 2, "warnings": []}
]

If no food is detected, return an empty array: []`;

// Parse Claude's response into FoodItem array
function parseAnalysisResponse(content: string): FoodItem[] {
  try {
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON array found in response');
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item: any) => ({
      id: generateId(),
      name: item.name || 'Unknown Food',
      portionSize: item.portionSize || item.portion || '1 serving',
      score: Math.min(3, Math.max(1, item.score || 2)),
      warnings: Array.isArray(item.warnings) ? item.warnings : [],
    }));
  } catch (error) {
    console.error('Error parsing analysis response:', error);
    return [];
  }
}

// Analyze text description of foods
export async function analyzeText(foodDescription: string): Promise<AnalysisResult> {
  if (!API_CONFIG.ANTHROPIC_API_KEY) {
    return getDemoTextAnalysis(foodDescription);
  }

  try {
    const response = await fetch(API_CONFIG.ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${ANALYSIS_PROMPT}\n\nFood description: ${foodDescription}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        foods: [],
        error: `API request failed: ${response.status}`,
      };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    const foods = parseAnalysisResponse(content || '[]');

    return {
      success: true,
      foods,
    };
  } catch (error) {
    return {
      success: false,
      foods: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Score a single food locally using the Mido scoring criteria.
// This keeps manual entry useful and instant without needing an API key.
export function scoreFoodLocally(name: string): { score: number; warnings: string[] } {
  const lower = name.toLowerCase();
  const warnings: string[] = [];

  const matchedHigh = SCORING_CRITERIA.HIGH_SCORE_KEYWORDS.some((kw) =>
    lower.includes(kw)
  );
  const matchedLow = SCORING_CRITERIA.LOW_SCORE_KEYWORDS.filter((kw) =>
    lower.includes(kw)
  );

  if (matchedLow.length > 0) {
    if (lower.includes('fried')) warnings.push('Fried — may stress your ENS');
    if (
      lower.includes('sugar') ||
      lower.includes('syrup') ||
      lower.includes('high fructose')
    )
      warnings.push('High in added sugar');
    if (
      lower.includes('processed') ||
      lower.includes('refined') ||
      lower.includes('fast food') ||
      lower.includes('junk')
    )
      warnings.push('Highly processed');
    if (
      lower.includes('seed oil') ||
      lower.includes('vegetable oil') ||
      lower.includes('canola') ||
      lower.includes('soybean oil')
    )
      warnings.push('Contains inflammatory seed oils');
    return { score: 1, warnings };
  }

  if (matchedHigh) {
    return { score: 3, warnings };
  }

  return { score: 2, warnings };
}

// Local text analysis when no API key is configured.
// Uses keyword-based scoring so typed meals get meaningful, useful feedback.
function getDemoTextAnalysis(description: string): AnalysisResult {
  const items = description
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    success: true,
    foods: items.map((name) => {
      const { score, warnings } = scoreFoodLocally(name);
      return {
        id: generateId(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        portionSize: '1 serving',
        score,
        warnings,
      };
    }),
  };
}

// Lookup barcode using Open Food Facts API (free, no key required)
export async function lookupBarcode(barcode: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (!response.ok) {
      return {
        success: false,
        foods: [],
        error: 'Product not found',
      };
    }

    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return {
        success: false,
        foods: [],
        error: 'Product not found in database',
      };
    }

    const product = data.product;
    const score = calculateProductScore(product);

    return {
      success: true,
      foods: [
        {
          id: generateId(),
          name: product.product_name || 'Unknown Product',
          brand: product.brands || undefined,
          upc: barcode,
          servingSize: product.serving_size || '1 serving',
          score,
          warnings: getProductWarnings(product),
        },
      ],
    };
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return {
      success: false,
      foods: [],
      error: 'Failed to lookup barcode',
    };
  }
}

// Calculate score based on Open Food Facts data
function calculateProductScore(product: any): number {
  // Use Nutri-Score if available (A=best, E=worst)
  const nutriScore = product.nutriscore_grade?.toLowerCase();
  if (nutriScore) {
    switch (nutriScore) {
      case 'a':
        return 3;
      case 'b':
        return 3;
      case 'c':
        return 2;
      case 'd':
        return 1;
      case 'e':
        return 1;
    }
  }

  // Check NOVA group (1=unprocessed, 4=ultra-processed)
  const novaGroup = product.nova_group;
  if (novaGroup) {
    if (novaGroup <= 2) return 3;
    if (novaGroup === 3) return 2;
    return 1;
  }

  // Default score
  return 2;
}

// Get warnings from product data
function getProductWarnings(product: any): string[] {
  const warnings: string[] = [];

  // Check allergens
  if (product.allergens_tags?.length > 0) {
    const allergens = product.allergens_tags
      .map((a: string) => a.replace('en:', ''))
      .join(', ');
    warnings.push(`Contains: ${allergens}`);
  }

  // Check additives
  if (product.additives_n > 5) {
    warnings.push('Contains multiple additives');
  }

  // Check NOVA group
  if (product.nova_group === 4) {
    warnings.push('Ultra-processed food');
  }

  // High sugar
  if (product.nutriments?.sugars_100g > 15) {
    warnings.push('High in sugar');
  }

  return warnings;
}
