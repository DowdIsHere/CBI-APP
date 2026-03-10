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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get user from auth header
    const authHeader = req.headers.get("authorization") || "";
    const supabaseAnon = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY") || SUPABASE_SERVICE_ROLE_KEY
    );

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabaseAnon.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { ingredients, food_name } = await req.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      return new Response(
        JSON.stringify({ error: "ingredients array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user's triggers
    const { data: triggers, error } = await supabase
      .from("user_triggers")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    if (!triggers || triggers.length === 0) {
      return new Response(
        JSON.stringify({
          detected: [],
          message: "No triggers configured for this user",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check each trigger against ingredients
    const detected: {
      trigger_name: string;
      severity: string;
      matched_ingredient: string;
      symptoms: string[];
    }[] = [];

    for (const trigger of triggers) {
      const patterns = trigger.ingredient_patterns || [];
      for (const pattern of patterns) {
        const patternLower = pattern.toLowerCase();
        for (const ingredient of ingredients) {
          const ingredientLower = ingredient.toLowerCase();
          if (
            ingredientLower.includes(patternLower) ||
            patternLower.includes(ingredientLower)
          ) {
            detected.push({
              trigger_name: trigger.trigger_name,
              severity: trigger.severity,
              matched_ingredient: ingredient,
              symptoms: trigger.symptoms || [],
            });

            // Update reaction count
            await supabase
              .from("user_triggers")
              .update({
                reaction_count: (trigger.reaction_count || 0) + 1,
                last_reaction_date: new Date().toISOString().split("T")[0],
              })
              .eq("id", trigger.id);

            break; // One match per trigger is enough
          }
        }
      }
    }

    const severity =
      detected.length === 0
        ? "safe"
        : detected.some((d) => d.severity === "severe")
        ? "danger"
        : detected.some((d) => d.severity === "moderate")
        ? "warning"
        : "caution";

    return new Response(
      JSON.stringify({
        detected,
        severity_level: severity,
        food_name: food_name || "Unknown",
        total_triggers_found: detected.length,
        message:
          detected.length === 0
            ? "No known triggers detected"
            : `Found ${detected.length} trigger(s) in this food`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to check triggers",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
