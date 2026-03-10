import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { barcode, user_triggers } = await req.json();

    if (!barcode) {
      return new Response(
        JSON.stringify({ error: "barcode is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Check our local database first
    const { data: localFood } = await supabase
      .from("foods")
      .select("*")
      .eq("barcode", barcode)
      .single();

    if (localFood) {
      // Check triggers against local food
      const triggers = checkTriggers(
        localFood.ingredients || [],
        user_triggers || []
      );

      return new Response(
        JSON.stringify({
          source: "database",
          food: {
            name: localFood.name,
            brand: localFood.brand,
            barcode: localFood.barcode,
            category: localFood.category,
            inflammation_score: localFood.base_inflammation_score,
            ingredients: localFood.ingredients,
            nutrients: {
              calories: localFood.calories_per_100g,
              net_carbs: localFood.net_carbs_per_100g,
              protein: localFood.protein_per_100g,
              fat: localFood.fat_per_100g,
              fiber: localFood.fiber_per_100g,
            },
            warnings: triggers.map((t) => t.warning),
            triggers_detected: triggers,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Try Open Food Facts API
    const offResponse = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );
    const offData = await offResponse.json();

    if (offData.status === 1 && offData.product) {
      const product = offData.product;
      const ingredientsText =
        product.ingredients_text_en || product.ingredients_text || "";
      const productName =
        product.product_name_en || product.product_name || "Unknown Product";
      const brand = product.brands || "";

      // Step 3: Use Claude to score the ingredients
      let inflammationScore = 0;
      let warnings: string[] = [];

      if (ANTHROPIC_API_KEY && ingredientsText) {
        const triggerContext = user_triggers?.length
          ? `\nUser's known triggers: ${user_triggers.join(", ")}`
          : "";

        const claudeResponse = await fetch(
          "https://api.anthropic.com/v1/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 512,
              messages: [
                {
                  role: "user",
                  content: `Score this packaged food product for inflammation using the Dowd Protocol scale (-3 to +3).

Product: ${productName}
Brand: ${brand}
Ingredients: ${ingredientsText}
${triggerContext}

Key scoring rules:
- Seed oils (soybean, canola, sunflower, safflower, corn, cottonseed, rapeseed, vegetable oil): -2 to -3
- Synthetic preservatives (TBHQ, BHA, BHT, calcium propionate): -3
- Artificial sweeteners (aspartame, sucralose, acesulfame-k): -2
- High fructose corn syrup: -2
- Natural whole food ingredients: +1 to +2
- Minimal processing with clean ingredients: +1

Respond ONLY with JSON:
{
  "inflammation_score": <number from -3 to 3>,
  "warnings": ["list of concerns"],
  "key_ingredients": {
    "beneficial": ["list"],
    "harmful": ["list"]
  }
}`,
                },
              ],
            }),
          }
        );

        if (claudeResponse.ok) {
          const claudeData = await claudeResponse.json();
          const text = claudeData.content?.[0]?.text || "";
          try {
            let jsonStr = text;
            const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (match) jsonStr = match[1];
            const scored = JSON.parse(jsonStr.trim());
            inflammationScore = scored.inflammation_score || 0;
            warnings = scored.warnings || [];
          } catch {
            // Fall back to rule-based scoring
            inflammationScore = scoreIngredients(ingredientsText);
          }
        }
      } else {
        inflammationScore = scoreIngredients(ingredientsText);
      }

      // Check user triggers
      const ingredients = ingredientsText
        .split(/[,;]/)
        .map((i: string) => i.trim().toLowerCase())
        .filter(Boolean);
      const triggers = checkTriggers(ingredients, user_triggers || []);
      if (triggers.length > 0) {
        warnings.push(
          ...triggers.map((t) => t.warning)
        );
      }

      const nutriments = product.nutriments || {};
      const foodRecord = {
        name: productName,
        brand: brand,
        barcode: barcode,
        category: product.categories_tags?.[0] || null,
        ingredients: ingredients,
        ingredients_text: ingredientsText,
        base_inflammation_score: inflammationScore,
        calories_per_100g: nutriments["energy-kcal_100g"] || null,
        net_carbs_per_100g:
          (nutriments.carbohydrates_100g || 0) -
          (nutriments.fiber_100g || 0) || null,
        protein_per_100g: nutriments.proteins_100g || null,
        fat_per_100g: nutriments.fat_100g || null,
        fiber_per_100g: nutriments.fiber_100g || null,
        source: "openfoodfacts",
        verified: false,
      };

      // Save to our database for future lookups
      await supabase.from("foods").upsert(foodRecord, {
        onConflict: "barcode",
      });

      return new Response(
        JSON.stringify({
          source: "openfoodfacts",
          food: {
            name: productName,
            brand: brand,
            barcode: barcode,
            inflammation_score: inflammationScore,
            ingredients: ingredients,
            nutrients: {
              calories: nutriments["energy-kcal_100g"],
              net_carbs:
                (nutriments.carbohydrates_100g || 0) -
                (nutriments.fiber_100g || 0),
              protein: nutriments.proteins_100g,
              fat: nutriments.fat_100g,
              fiber: nutriments.fiber_100g,
            },
            warnings,
            triggers_detected: triggers,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Product not found anywhere
    return new Response(
      JSON.stringify({
        error: "Product not found",
        barcode,
        suggestion:
          "Try scanning again or enter the food manually",
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to scan barcode",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Rule-based fallback scoring
function scoreIngredients(ingredientsText: string): number {
  const lower = ingredientsText.toLowerCase();
  let score = 0;

  // Harmful ingredients
  const harmful: [RegExp, number][] = [
    [/soybean oil|canola oil|sunflower oil|safflower oil|corn oil|cottonseed oil|vegetable oil|rapeseed oil/, -2],
    [/tbhq|bha|bht|calcium propionate/, -3],
    [/aspartame|sucralose|acesulfame/, -2],
    [/high fructose corn syrup|hfcs/, -2],
    [/artificial color|red 40|yellow [56]|blue [12]/, -1],
    [/sodium nitrite|sodium nitrate/, -1],
    [/monosodium glutamate|msg/, -1],
    [/partially hydrogenated|trans fat/, -3],
  ];

  // Beneficial indicators
  const beneficial: [RegExp, number][] = [
    [/organic/, 0.5],
    [/grass.?fed|pasture.?raised|wild.?caught/, 1],
    [/extra virgin olive oil|avocado oil|coconut oil/, 1],
    [/fermented|probiotic|cultured/, 1],
  ];

  for (const [pattern, penalty] of harmful) {
    if (pattern.test(lower)) score += penalty;
  }
  for (const [pattern, bonus] of beneficial) {
    if (pattern.test(lower)) score += bonus;
  }

  return Math.max(-3, Math.min(3, Math.round(score)));
}

function checkTriggers(
  ingredients: string[],
  userTriggers: string[]
): { trigger: string; ingredient: string; warning: string }[] {
  const detected: { trigger: string; ingredient: string; warning: string }[] = [];

  for (const trigger of userTriggers) {
    const triggerLower = trigger.toLowerCase();
    for (const ingredient of ingredients) {
      const ingredientLower =
        typeof ingredient === "string" ? ingredient.toLowerCase() : "";
      if (
        ingredientLower.includes(triggerLower) ||
        triggerLower.includes(ingredientLower)
      ) {
        detected.push({
          trigger,
          ingredient,
          warning: `Contains "${ingredient}" - matches your trigger "${trigger}"`,
        });
      }
    }
  }

  return detected;
}
