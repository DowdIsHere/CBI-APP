import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AnalyzedFood {
  name: string;
  portion_size: string;
  inflammation_score: number;
  confidence: number;
  warnings: string[];
  nutrients: {
    estimated_calories?: number;
    estimated_net_carbs?: number;
    estimated_protein?: number;
    estimated_fat?: number;
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const { image_base64, user_triggers } = await req.json();

    if (!image_base64) {
      return new Response(
        JSON.stringify({ error: "image_base64 is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mediaType = image_base64.startsWith("/9j/")
      ? "image/jpeg"
      : image_base64.startsWith("iVBOR")
      ? "image/png"
      : "image/jpeg";

    const triggerContext = user_triggers?.length
      ? `\n\nThe user has the following known food triggers/sensitivities: ${user_triggers.join(", ")}. Flag any detected foods that match these triggers in the warnings array.`
      : "";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: image_base64,
                },
              },
              {
                type: "text",
                text: `You are a nutrition analysis AI for the Dowd Protocol / CBI (Cellular Biology Intelligence) app. Analyze this food photo and identify all visible food items.

For each food item, provide:
1. name: Common name of the food
2. portion_size: Estimated portion (e.g., "6 oz", "1 cup", "2 pieces")
3. inflammation_score: Score from -3 to +3 based on the Dowd Protocol:
   - +3: Wild-caught fatty fish (salmon, sardines, mackerel), bone broth
   - +2: Cruciferous vegetables, berries, fermented foods, turmeric, ginger, avocado, olive oil, nuts/seeds
   - +1: Clean proteins (chicken, turkey, eggs, grass-fed beef), whole grains, most fruits/vegetables
   - 0: Neutral foods
   - -1: Processed foods, refined carbs, conventional dairy
   - -2: Foods with seed oils, artificial sweeteners, most fast food
   - -3: Highly processed foods with synthetic preservatives (TBHQ, BHA/BHT), trans fats
4. confidence: 0.0 to 1.0 how confident you are in the identification
5. warnings: Array of strings for any concerns (e.g., "likely contains seed oils", "high in refined sugar")
6. nutrients: Estimated macros per the visible portion

${triggerContext}

Respond ONLY with valid JSON in this exact format:
{
  "foods": [
    {
      "name": "Food Name",
      "portion_size": "estimated portion",
      "inflammation_score": 2,
      "confidence": 0.9,
      "warnings": [],
      "nutrients": {
        "estimated_calories": 250,
        "estimated_net_carbs": 5,
        "estimated_protein": 30,
        "estimated_fat": 12
      }
    }
  ],
  "meal_notes": "Brief overall assessment of this meal for inflammation"
}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.content?.find(
      (c: { type: string }) => c.type === "text"
    );

    if (!textContent?.text) {
      throw new Error("No text response from Anthropic");
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = textContent.text;
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const result = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze photo",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
