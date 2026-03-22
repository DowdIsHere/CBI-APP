import { Platform } from 'react-native';
import { API_CONFIG } from './config';
import { FoodItem } from '../data/types';
import { checkNetworkConnection, ErrorMessages } from './errorHandling';

interface AnalysisResult {
  success: boolean;
  foods: FoodItem[];
  error?: string;
  errorType?: 'network' | 'api' | 'parse' | 'unknown';
}

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Convert image URI to base64 (works on both native and web)
async function imageToBase64(uri: string): Promise<string> {
  try {
    if (Platform.OS === 'web') {
      // On web, image URIs from ImagePicker are blob/object URLs or data URIs
      if (uri.startsWith('data:')) {
        // Already a data URI - extract the base64 part
        return uri.split(',')[1];
      }
      // Fetch the blob and convert to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // On native, use expo-file-system
      const { readAsStringAsync } = await import('expo-file-system');
      const base64 = await readAsStringAsync(uri, {
        encoding: 'base64' as any,
      });
      return base64;
    }
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

// Get media type from URI
function getMediaType(uri: string): string {
  const extension = uri.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

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

// Analyze food photo using Claude Vision
export async function analyzePhoto(imageUri: string): Promise<AnalysisResult> {
  // Try backend API first (keeps API key server-side)
  try {
    const { analyzeFood } = await import('./api');
    const base64Image = await imageToBase64(imageUri);
    const mediaType = getMediaType(imageUri);
    const backendResult = await analyzeFood(base64Image, mediaType);
    if (backendResult.success && backendResult.foods.length > 0) {
      return { success: true, foods: backendResult.foods };
    }
  } catch (e) {
    console.log('Backend analysis unavailable, trying local fallback');
  }

  if (!API_CONFIG.ANTHROPIC_API_KEY) {
    // Return demo data if no API key configured
    console.log('No API key configured, using demo analysis');
    return getDemoAnalysis();
  }

  // Check network connectivity first
  const isConnected = await checkNetworkConnection();
  if (!isConnected) {
    return {
      success: false,
      foods: [],
      error: ErrorMessages.NETWORK_OFFLINE,
      errorType: 'network',
    };
  }

  try {
    const base64Image = await imageToBase64(imageUri);
    const mediaType = getMediaType(imageUri);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: ANALYSIS_PROMPT,
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);

      // Provide user-friendly error messages based on status code
      let userMessage = 'Unable to analyze the photo. Please try again.';
      if (response.status === 401 || response.status === 403) {
        userMessage = 'Authentication error. Please check your API key.';
      } else if (response.status === 429) {
        userMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (response.status >= 500) {
        userMessage = 'The analysis service is temporarily unavailable. Please try again later.';
      }

      return {
        success: false,
        foods: [],
        error: userMessage,
        errorType: 'api',
      };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      return {
        success: false,
        foods: [],
        error: 'No food items could be identified in the image. Try taking a clearer photo.',
        errorType: 'parse',
      };
    }

    // Parse JSON response
    const foods = parseAnalysisResponse(content);

    if (foods.length === 0) {
      return {
        success: true,
        foods: [],
        error: 'No food detected in the image. Try taking a photo of your meal from a different angle.',
      };
    }

    return {
      success: true,
      foods,
    };
  } catch (error) {
    console.error('Analysis error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          foods: [],
          error: 'Analysis is taking too long. Please try again with a smaller image.',
          errorType: 'network',
        };
      }

      if (error.message.includes('Network') || error.message.includes('fetch')) {
        return {
          success: false,
          foods: [],
          error: ErrorMessages.NETWORK_OFFLINE,
          errorType: 'network',
        };
      }
    }

    return {
      success: false,
      foods: [],
      error: ErrorMessages.ANALYSIS_FAILED,
      errorType: 'unknown',
    };
  }
}

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

// Demo analysis when no API key is configured
function getDemoAnalysis(): AnalysisResult {
  return {
    success: true,
    foods: [
      {
        id: generateId(),
        name: 'Grilled Salmon',
        portionSize: '6 oz',
        score: 3,
        warnings: [],
      },
      {
        id: generateId(),
        name: 'Steamed Broccoli',
        portionSize: '1.5 cups',
        score: 3,
        warnings: [],
      },
      {
        id: generateId(),
        name: 'Olive Oil',
        portionSize: '1 tbsp',
        score: 3,
        warnings: [],
      },
    ],
  };
}

// Demo text analysis
function getDemoTextAnalysis(description: string): AnalysisResult {
  const items = description.split(',').map((item) => item.trim()).filter(Boolean);

  return {
    success: true,
    foods: items.map((name) => ({
      id: generateId(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      portionSize: '1 serving',
      score: 2,
      warnings: [],
    })),
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
