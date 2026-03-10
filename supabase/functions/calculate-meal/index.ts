import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MealFood {
  name: string;
  inflammation_score: number;
  portion_size?: string;
  nutrients?: {
    estimated_calories?: number;
    estimated_net_carbs?: number;
    estimated_protein?: number;
    estimated_fat?: number;
  };
}

interface SynergyBonus {
  name: string;
  foods: string[];
  bonus: number;
  reason: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { foods, current_phase } = await req.json();

    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      return new Response(
        JSON.stringify({ error: "foods array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const phase = current_phase || 1;

    // Calculate base inflammation score
    let totalScore = foods.reduce(
      (sum: number, f: MealFood) => sum + (f.inflammation_score || 0),
      0
    );

    // Check for food synergies
    const synergies = detectSynergies(foods);
    const synergyBonus = synergies.reduce((sum, s) => sum + s.bonus, 0);
    totalScore += synergyBonus;

    // Calculate macros
    const totalCalories = foods.reduce(
      (sum: number, f: MealFood) =>
        sum + (f.nutrients?.estimated_calories || 0),
      0
    );
    const totalNetCarbs = foods.reduce(
      (sum: number, f: MealFood) =>
        sum + (f.nutrients?.estimated_net_carbs || 0),
      0
    );
    const totalProtein = foods.reduce(
      (sum: number, f: MealFood) =>
        sum + (f.nutrients?.estimated_protein || 0),
      0
    );
    const totalFat = foods.reduce(
      (sum: number, f: MealFood) => sum + (f.nutrients?.estimated_fat || 0),
      0
    );

    // Net carb bonus/penalty
    const carbLimits: Record<number, number> = { 1: 20, 2: 30, 3: 50 };
    const carbLimit = carbLimits[phase] || 20;
    let carbAdjustment = 0;
    if (totalNetCarbs > 0) {
      if (totalNetCarbs <= carbLimit * 0.75) {
        carbAdjustment = 1; // Well under limit
      } else if (totalNetCarbs > carbLimit) {
        carbAdjustment = -1; // Over limit
      }
    }
    totalScore += carbAdjustment;

    // Phase appropriateness
    const phaseAppropriate = checkPhaseAppropriateness(foods, phase);

    // Generate recommendations
    const recommendations = generateRecommendations(
      foods,
      totalScore,
      totalNetCarbs,
      carbLimit,
      phase
    );

    // Determine if meets target
    const meetsTarget = totalScore >= (phase === 1 ? 4 : phase === 2 ? 3 : 2);

    return new Response(
      JSON.stringify({
        total_inflammation_score: totalScore,
        total_calories: Math.round(totalCalories),
        total_net_carbs: Math.round(totalNetCarbs * 10) / 10,
        total_protein: Math.round(totalProtein * 10) / 10,
        total_fat: Math.round(totalFat * 10) / 10,
        synergy_bonuses: synergies,
        carb_adjustment: carbAdjustment,
        phase_appropriate: phaseAppropriate,
        meets_target: meetsTarget,
        recommendations,
        food_count: foods.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to calculate meal",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function detectSynergies(foods: MealFood[]): SynergyBonus[] {
  const synergies: SynergyBonus[] = [];
  const names = foods.map((f) => f.name.toLowerCase());

  // Turmeric + Black Pepper = 2000% curcumin absorption
  if (
    names.some((n) => n.includes("turmeric")) &&
    names.some((n) => n.includes("pepper"))
  ) {
    synergies.push({
      name: "Curcumin Activation",
      foods: ["Turmeric", "Black Pepper"],
      bonus: 1,
      reason:
        "Piperine increases curcumin absorption by 2000%",
    });
  }

  // Omega-3 Fish + Cruciferous Vegetables
  const omega3Fish = names.some(
    (n) =>
      n.includes("salmon") ||
      n.includes("sardine") ||
      n.includes("mackerel") ||
      n.includes("anchov")
  );
  const cruciferous = names.some(
    (n) =>
      n.includes("broccoli") ||
      n.includes("kale") ||
      n.includes("cauliflower") ||
      n.includes("cabbage") ||
      n.includes("brussels")
  );
  if (omega3Fish && cruciferous) {
    synergies.push({
      name: "Omega-3 + DIM Pathway",
      foods: ["Fatty Fish", "Cruciferous Vegetable"],
      bonus: 1,
      reason:
        "DIM from cruciferous vegetables enhances omega-3 anti-inflammatory pathways",
    });
  }

  // Fermented + Fiber
  const fermented = names.some(
    (n) =>
      n.includes("kimchi") ||
      n.includes("sauerkraut") ||
      n.includes("kefir") ||
      n.includes("yogurt") ||
      n.includes("miso") ||
      n.includes("kombucha")
  );
  const fiber = names.some(
    (n) =>
      n.includes("sweet potato") ||
      n.includes("lentil") ||
      n.includes("bean") ||
      n.includes("oat") ||
      n.includes("flax") ||
      n.includes("chia")
  );
  if (fermented && fiber) {
    synergies.push({
      name: "Probiotic + Prebiotic",
      foods: ["Fermented Food", "High-Fiber Food"],
      bonus: 1,
      reason:
        "Prebiotics feed probiotics, amplifying gut healing effects",
    });
  }

  // Healthy Fat + Fat-Soluble Vitamins
  const healthyFat = names.some(
    (n) =>
      n.includes("avocado") ||
      n.includes("olive oil") ||
      n.includes("coconut oil") ||
      n.includes("ghee") ||
      n.includes("butter")
  );
  const fatSoluble = names.some(
    (n) =>
      n.includes("spinach") ||
      n.includes("kale") ||
      n.includes("sweet potato") ||
      n.includes("carrot")
  );
  if (healthyFat && fatSoluble) {
    synergies.push({
      name: "Fat-Soluble Vitamin Boost",
      foods: ["Healthy Fat", "Vitamin-Rich Vegetable"],
      bonus: 1,
      reason:
        "Healthy fats increase absorption of vitamins A, D, E, K",
    });
  }

  return synergies;
}

function checkPhaseAppropriateness(
  foods: MealFood[],
  phase: number
): boolean {
  // Phase 1: Strict elimination - no negative scoring foods allowed
  if (phase === 1) {
    return foods.every((f) => f.inflammation_score >= 0);
  }
  // Phase 2: Reintroduction - allow some -1 foods
  if (phase === 2) {
    return foods.every((f) => f.inflammation_score >= -1);
  }
  // Phase 3: Maintenance
  return true;
}

function generateRecommendations(
  foods: MealFood[],
  totalScore: number,
  totalNetCarbs: number,
  carbLimit: number,
  phase: number
): string[] {
  const recommendations: string[] = [];
  const names = foods.map((f) => f.name.toLowerCase());

  if (totalScore < 0) {
    recommendations.push(
      "This meal has a negative inflammation score. Consider replacing processed items with whole foods."
    );
  }

  if (totalNetCarbs > carbLimit) {
    recommendations.push(
      `Net carbs (${Math.round(totalNetCarbs)}g) exceed your Phase ${phase} limit of ${carbLimit}g. Consider reducing starchy items.`
    );
  }

  if (!names.some((n) => /salmon|sardine|mackerel|anchov|tuna|trout/.test(n))) {
    recommendations.push(
      "Consider adding omega-3 rich fish for maximum anti-inflammatory benefit."
    );
  }

  if (
    !names.some((n) =>
      /broccoli|kale|cabbage|cauliflower|brussels|spinach|arugula/.test(n)
    )
  ) {
    recommendations.push(
      "Adding a cruciferous vegetable or leafy green would boost this meal's score."
    );
  }

  if (foods.length === 1) {
    recommendations.push(
      "Food synergies require multiple items. Pair foods for bonus anti-inflammatory effects."
    );
  }

  return recommendations;
}
