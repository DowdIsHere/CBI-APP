import { FoodItem } from './types';

// Mitochondria nutrient-focused food catalog.
// Six categories of foods that support energy production and cellular health.

export type NutrientId = 'coq10' | 'omega3' | 'b12' | 'vitaminD' | 'ala' | 'zinc';

export interface NutrientCategory {
  id: NutrientId;
  title: string;
  subtitle: string;
  color: string; // accent
  bg: string;    // light background
  icon: string;  // Ionicons name
  target: number; // daily target in `unit`
  unit: string;
  targetNote?: string; // honesty note shown in the ATP meter detail
}

// Targets: RDA/AI where one exists (B12, vitamin D, zinc, omega-3s);
// food-realistic support targets for CoQ10 and ALA, which have no RDA
// because the body synthesizes them — study doses are supplement-only.
export const NUTRIENT_CATEGORIES: NutrientCategory[] = [
  {
    id: 'coq10', title: 'CoQ10', subtitle: 'Highest concentrations',
    color: '#c2410c', bg: '#fff7ed', icon: 'flash',
    target: 30, unit: 'mg',
    targetNote: 'No RDA — your body makes most of it. 30 mg is a strong dietary intake; study doses (100–300 mg) are only reachable with supplements.',
  },
  {
    id: 'omega3', title: 'Omega-3s', subtitle: 'EPA/DHA and ALA',
    color: '#1e3a8a', bg: '#eff6ff', icon: 'fish',
    target: 500, unit: 'mg',
    targetNote: 'EPA+DHA. Plant sources are counted at a conversion-adjusted value since the body converts plant ALA poorly.',
  },
  {
    id: 'b12', title: 'B12', subtitle: 'Bioactive forms',
    color: '#7c3aed', bg: '#f5f3ff', icon: 'cellular',
    target: 2.4, unit: 'mcg',
  },
  {
    id: 'vitaminD', title: 'Vitamin D', subtitle: 'D3 preferred',
    color: '#15803d', bg: '#f0fdf4', icon: 'sunny',
    target: 600, unit: 'IU',
    targetNote: 'Sunlight is the primary source — food alone rarely covers the full 600 IU.',
  },
  {
    id: 'ala', title: 'Alpha-Lipoic Acid', subtitle: 'Antioxidant support',
    color: '#a16207', bg: '#fefce8', icon: 'shield-checkmark',
    target: 200, unit: 'mcg',
    targetNote: 'No RDA — endogenous. Food carries only micrograms; study doses (300–600 mg) are ~1,000× food levels and supplement-only. Food supplies the building blocks for your own production.',
  },
  {
    id: 'zinc', title: 'Zinc', subtitle: 'Bioavailable forms',
    color: '#0f766e', bg: '#f0fdfa', icon: 'magnet',
    target: 11, unit: 'mg',
  },
];

export interface MitoFood {
  name: string;
  nutrients: NutrientId[];
  score: number; // 2 = good, 3 = excellent
  serving: string; // typical serving the amounts below describe
  // Approximate contribution per serving, in each nutrient's unit.
  amounts: Partial<Record<NutrientId, number>>;
  note?: string;
}

// One entry per food; foods that serve several nutrients are tagged with all of them.
// Amounts are typical-serving estimates from published nutrient databases.
export const MITO_FOODS: MitoFood[] = [
  // Organ meats & red meat
  { name: 'Organ meats (liver, heart, kidney)', nutrients: ['coq10', 'b12', 'ala'], score: 3, serving: '3 oz', amounts: { coq10: 15, b12: 60, ala: 100 } },
  { name: 'Grass-fed beef', nutrients: ['coq10', 'omega3', 'b12', 'zinc', 'ala'], score: 3, serving: '3 oz', amounts: { coq10: 3, omega3: 50, b12: 2.5, zinc: 5, ala: 50 } },
  { name: 'Lamb', nutrients: ['omega3', 'zinc', 'ala'], score: 3, serving: '3 oz', amounts: { omega3: 100, zinc: 4, ala: 50 } },
  { name: 'Pork', nutrients: ['coq10'], score: 2, serving: '3 oz', amounts: { coq10: 2 } },

  // Fish & seafood
  { name: 'Wild salmon', nutrients: ['coq10', 'omega3', 'b12', 'vitaminD'], score: 3, serving: '3 oz', amounts: { coq10: 1, omega3: 1500, b12: 4.5, vitaminD: 500 } },
  { name: 'Sardines', nutrients: ['coq10', 'omega3', 'b12', 'vitaminD'], score: 3, serving: '3 oz', amounts: { coq10: 2, omega3: 1200, b12: 7.5, vitaminD: 175 } },
  { name: 'Mackerel', nutrients: ['coq10', 'omega3', 'vitaminD'], score: 3, serving: '3 oz', amounts: { coq10: 2, omega3: 1000, vitaminD: 400 } },
  { name: 'Anchovies', nutrients: ['omega3'], score: 3, serving: '1 oz', amounts: { omega3: 600 } },
  { name: 'Herring', nutrients: ['omega3'], score: 3, serving: '3 oz', amounts: { omega3: 1500 } },
  { name: 'Tuna', nutrients: ['b12'], score: 2, serving: '3 oz', amounts: { b12: 2.5 } },
  { name: 'Fish roe / caviar', nutrients: ['omega3'], score: 3, serving: '1 oz', amounts: { omega3: 1000 } },
  { name: 'Cod liver oil', nutrients: ['omega3', 'vitaminD'], score: 3, serving: '1 tsp', amounts: { omega3: 900, vitaminD: 450 } },
  { name: 'Clams', nutrients: ['b12'], score: 3, serving: '3 oz', amounts: { b12: 84 }, note: 'Highest B12 source' },
  { name: 'Mussels', nutrients: ['b12'], score: 3, serving: '3 oz', amounts: { b12: 20 } },
  { name: 'Oysters', nutrients: ['b12', 'zinc'], score: 3, serving: '6 medium', amounts: { b12: 15, zinc: 30 }, note: 'Highest zinc source by far' },

  // Poultry & eggs
  { name: 'Chicken thigh/leg (dark meat)', nutrients: ['coq10', 'zinc'], score: 2, serving: '3 oz', amounts: { coq10: 1.5, zinc: 2 } },
  { name: 'Chicken / turkey', nutrients: ['zinc'], score: 2, serving: '3 oz', amounts: { zinc: 2 } },
  { name: 'Pasture-raised eggs', nutrients: ['omega3', 'b12', 'vitaminD'], score: 3, serving: '2 eggs', amounts: { omega3: 100, b12: 1, vitaminD: 80 } },

  // Nuts & seeds
  { name: 'Sesame seeds', nutrients: ['coq10', 'zinc'], score: 3, serving: '1 tbsp', amounts: { coq10: 0.5, zinc: 1 } },
  { name: 'Pistachios', nutrients: ['coq10'], score: 2, serving: '1 oz', amounts: { coq10: 0.6 } },
  { name: 'Walnuts', nutrients: ['omega3'], score: 3, serving: '1 oz', amounts: { omega3: 130 } },
  { name: 'Flax seeds', nutrients: ['omega3'], score: 3, serving: '1 tbsp', amounts: { omega3: 120 } },
  { name: 'Chia seeds', nutrients: ['omega3'], score: 3, serving: '1 tbsp', amounts: { omega3: 90 } },
  { name: 'Hemp seeds', nutrients: ['omega3'], score: 3, serving: '1 tbsp', amounts: { omega3: 50 } },
  { name: 'Pumpkin seeds', nutrients: ['zinc'], score: 3, serving: '1 oz', amounts: { zinc: 2.2 } },
  { name: 'Cashews', nutrients: ['zinc'], score: 2, serving: '1 oz', amounts: { zinc: 1.6 } },
  { name: 'Pine nuts', nutrients: ['zinc'], score: 2, serving: '1 oz', amounts: { zinc: 1.8 } },

  // Vegetables & plants
  { name: 'Broccoli', nutrients: ['coq10', 'ala'], score: 3, serving: '1 cup', amounts: { coq10: 0.5, ala: 25 } },
  { name: 'Cauliflower', nutrients: ['coq10'], score: 2, serving: '1 cup', amounts: { coq10: 0.4 } },
  { name: 'Spinach', nutrients: ['ala'], score: 3, serving: '1 cup cooked', amounts: { ala: 30 } },
  { name: 'Tomatoes', nutrients: ['ala'], score: 2, serving: '1 medium', amounts: { ala: 15 } },
  { name: 'Brussels sprouts', nutrients: ['ala'], score: 3, serving: '1 cup', amounts: { ala: 25 } },
  { name: 'Peas', nutrients: ['ala'], score: 2, serving: '1/2 cup', amounts: { ala: 15 } },
  { name: 'Rice bran', nutrients: ['ala'], score: 2, serving: '1 tbsp', amounts: { ala: 20 } },
  { name: 'Purslane', nutrients: ['omega3'], score: 3, serving: '1 cup', amounts: { omega3: 60 }, note: 'Highest plant source of EPA' },
  { name: 'Algae oil', nutrients: ['omega3'], score: 3, serving: '1 tsp', amounts: { omega3: 400 }, note: 'Vegetarian EPA/DHA' },
  { name: 'Mushrooms (UV-exposed)', nutrients: ['vitaminD'], score: 3, serving: '1 cup', amounts: { vitaminD: 400 } },

  // Other
  { name: 'Dark chocolate (70%+)', nutrients: ['coq10', 'zinc'], score: 2, serving: '1 oz', amounts: { coq10: 0.5, zinc: 0.9 } },
  { name: 'Nutritional yeast (fortified)', nutrients: ['b12'], score: 2, serving: '1 tbsp', amounts: { b12: 2.4 } },
  { name: 'Fortified dairy', nutrients: ['vitaminD'], score: 2, serving: '1 cup', amounts: { vitaminD: 120 } },
  { name: 'Legumes (soaked/sprouted)', nutrients: ['zinc'], score: 2, serving: '1/2 cup', amounts: { zinc: 1.3 } },
];

export function foodsForNutrient(nutrient: NutrientId): MitoFood[] {
  return MITO_FOODS.filter((f) => f.nutrients.includes(nutrient));
}

const FOOD_BY_NAME = new Map(MITO_FOODS.map((f) => [f.name.toLowerCase(), f]));

// Keyword fallback so typed/custom foods still count toward nutrient coverage.
const NUTRIENT_KEYWORDS: Record<NutrientId, string[]> = {
  coq10: ['liver', 'heart', 'kidney', 'organ meat', 'sardine', 'mackerel', 'salmon', 'beef', 'pork', 'dark meat', 'chicken thigh', 'sesame', 'pistachio', 'broccoli', 'cauliflower', 'dark chocolate'],
  omega3: ['salmon', 'sardine', 'anchov', 'herring', 'mackerel', 'roe', 'caviar', 'walnut', 'flax', 'chia', 'hemp seed', 'algae', 'purslane', 'cod liver', 'egg'],
  b12: ['clam', 'mussel', 'oyster', 'liver', 'sardine', 'salmon', 'tuna', 'nutritional yeast', 'beef', 'egg'],
  vitaminD: ['salmon', 'mackerel', 'sardine', 'cod liver', 'egg', 'mushroom', 'maitake', 'portobello', 'fortified'],
  ala: ['beef', 'lamb', 'red meat', 'liver', 'heart', 'kidney', 'organ meat', 'spinach', 'broccoli', 'tomato', 'brussels', 'peas', 'rice bran'],
  zinc: ['oyster', 'beef', 'lamb', 'pumpkin seed', 'sesame', 'chicken', 'turkey', 'cashew', 'pine nut', 'dark chocolate', 'legume', 'lentil', 'bean', 'chickpea'],
};

// Conservative per-serving credit for custom-typed foods that keyword-match
// a nutrient but aren't in the catalog (roughly a mid-tier serving).
const DEFAULT_AMOUNTS: Record<NutrientId, number> = {
  coq10: 2,
  omega3: 300,
  b12: 2,
  vitaminD: 100,
  ala: 25,
  zinc: 2,
};

export function matchNutrients(foodName: string): NutrientId[] {
  const lower = foodName.toLowerCase();
  return NUTRIENT_CATEGORIES.filter((c) =>
    NUTRIENT_KEYWORDS[c.id].some((kw) => lower.includes(kw))
  ).map((c) => c.id);
}

export interface NutrientCoverage {
  totals: Record<NutrientId, number>;   // amount consumed, per nutrient's unit
  percents: Record<NutrientId, number>; // 0-100, capped
  covered: NutrientId[];                // nutrients at 100% of target
  missing: NutrientId[];                // nutrients below 100%
  percent: number;                      // overall meter: average of capped percents
}

// Quantitative coverage: sums per-serving amounts against each daily target.
export function computeNutrientCoverage(items: FoodItem[]): NutrientCoverage {
  const totals = {} as Record<NutrientId, number>;
  NUTRIENT_CATEGORIES.forEach((c) => (totals[c.id] = 0));

  items.forEach((item) => {
    const catalog = FOOD_BY_NAME.get(item.name.toLowerCase());
    if (catalog) {
      (Object.keys(catalog.amounts) as NutrientId[]).forEach((n) => {
        totals[n] += catalog.amounts[n] || 0;
      });
    } else {
      // Custom/typed food: keyword match with a conservative default credit.
      const nutrients =
        item.nutrients && item.nutrients.length > 0
          ? (item.nutrients as NutrientId[])
          : matchNutrients(item.name);
      nutrients.forEach((n) => {
        totals[n] += DEFAULT_AMOUNTS[n];
      });
    }
  });

  const percents = {} as Record<NutrientId, number>;
  NUTRIENT_CATEGORIES.forEach((c) => {
    percents[c.id] = Math.min(100, Math.round((totals[c.id] / c.target) * 100));
  });

  const covered = NUTRIENT_CATEGORIES.filter((c) => percents[c.id] >= 100).map((c) => c.id);
  const missing = NUTRIENT_CATEGORIES.filter((c) => percents[c.id] < 100).map((c) => c.id);
  const percent = Math.round(
    NUTRIENT_CATEGORIES.reduce((sum, c) => sum + percents[c.id], 0) / NUTRIENT_CATEGORIES.length
  );

  return { totals, percents, covered, missing, percent };
}

// Display helper: "1,500 / 500 mg"
export function formatAmount(value: number): string {
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return rounded.toLocaleString('en-US');
}

// A few example foods to suggest for a missing nutrient, best contributors first.
export function suggestionsFor(nutrient: NutrientId, max = 3): string[] {
  return foodsForNutrient(nutrient)
    .slice()
    .sort((a, b) => (b.amounts[nutrient] || 0) - (a.amounts[nutrient] || 0))
    .slice(0, max)
    .map((f) => f.name);
}
