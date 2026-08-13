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
}

export const NUTRIENT_CATEGORIES: NutrientCategory[] = [
  { id: 'coq10', title: 'CoQ10', subtitle: 'Highest concentrations', color: '#c2410c', bg: '#fff7ed', icon: 'flash' },
  { id: 'omega3', title: 'Omega-3s', subtitle: 'EPA/DHA and ALA', color: '#1e3a8a', bg: '#eff6ff', icon: 'fish' },
  { id: 'b12', title: 'B12', subtitle: 'Bioactive forms', color: '#7c3aed', bg: '#f5f3ff', icon: 'cellular' },
  { id: 'vitaminD', title: 'Vitamin D', subtitle: 'D3 preferred', color: '#15803d', bg: '#f0fdf4', icon: 'sunny' },
  { id: 'ala', title: 'Alpha-Lipoic Acid', subtitle: 'Antioxidant support', color: '#a16207', bg: '#fefce8', icon: 'shield-checkmark' },
  { id: 'zinc', title: 'Zinc', subtitle: 'Bioavailable forms', color: '#0f766e', bg: '#f0fdfa', icon: 'magnet' },
];

export interface MitoFood {
  name: string;
  nutrients: NutrientId[];
  score: number; // 2 = good, 3 = excellent
  note?: string;
}

// One entry per food; foods that serve several nutrients are tagged with all of them.
export const MITO_FOODS: MitoFood[] = [
  // Organ meats & red meat
  { name: 'Organ meats (liver, heart, kidney)', nutrients: ['coq10', 'b12', 'ala'], score: 3 },
  { name: 'Grass-fed beef', nutrients: ['coq10', 'omega3', 'b12', 'zinc', 'ala'], score: 3 },
  { name: 'Lamb', nutrients: ['omega3', 'zinc', 'ala'], score: 3 },
  { name: 'Pork', nutrients: ['coq10'], score: 2 },

  // Fish & seafood
  { name: 'Wild salmon', nutrients: ['coq10', 'omega3', 'b12', 'vitaminD'], score: 3 },
  { name: 'Sardines', nutrients: ['coq10', 'omega3', 'b12', 'vitaminD'], score: 3 },
  { name: 'Mackerel', nutrients: ['coq10', 'omega3', 'vitaminD'], score: 3 },
  { name: 'Anchovies', nutrients: ['omega3'], score: 3 },
  { name: 'Herring', nutrients: ['omega3'], score: 3 },
  { name: 'Tuna', nutrients: ['b12'], score: 2 },
  { name: 'Fish roe / caviar', nutrients: ['omega3'], score: 3 },
  { name: 'Cod liver oil', nutrients: ['omega3', 'vitaminD'], score: 3 },
  { name: 'Clams', nutrients: ['b12'], score: 3, note: 'Highest B12 source' },
  { name: 'Mussels', nutrients: ['b12'], score: 3 },
  { name: 'Oysters', nutrients: ['b12', 'zinc'], score: 3, note: 'Highest zinc source by far' },

  // Poultry & eggs
  { name: 'Chicken thigh/leg (dark meat)', nutrients: ['coq10', 'zinc'], score: 2 },
  { name: 'Chicken / turkey', nutrients: ['zinc'], score: 2 },
  { name: 'Pasture-raised eggs', nutrients: ['omega3', 'b12', 'vitaminD'], score: 3 },

  // Nuts & seeds
  { name: 'Sesame seeds', nutrients: ['coq10', 'zinc'], score: 3 },
  { name: 'Pistachios', nutrients: ['coq10'], score: 2 },
  { name: 'Walnuts', nutrients: ['omega3'], score: 3 },
  { name: 'Flax seeds', nutrients: ['omega3'], score: 3 },
  { name: 'Chia seeds', nutrients: ['omega3'], score: 3 },
  { name: 'Hemp seeds', nutrients: ['omega3'], score: 3 },
  { name: 'Pumpkin seeds', nutrients: ['zinc'], score: 3 },
  { name: 'Cashews', nutrients: ['zinc'], score: 2 },
  { name: 'Pine nuts', nutrients: ['zinc'], score: 2 },

  // Vegetables & plants
  { name: 'Broccoli', nutrients: ['coq10', 'ala'], score: 3 },
  { name: 'Cauliflower', nutrients: ['coq10'], score: 2 },
  { name: 'Spinach', nutrients: ['ala'], score: 3 },
  { name: 'Tomatoes', nutrients: ['ala'], score: 2 },
  { name: 'Brussels sprouts', nutrients: ['ala'], score: 3 },
  { name: 'Peas', nutrients: ['ala'], score: 2 },
  { name: 'Rice bran', nutrients: ['ala'], score: 2 },
  { name: 'Purslane', nutrients: ['omega3'], score: 3, note: 'Highest plant source of EPA' },
  { name: 'Algae oil', nutrients: ['omega3'], score: 3, note: 'Vegetarian EPA/DHA' },
  { name: 'Mushrooms (UV-exposed)', nutrients: ['vitaminD'], score: 3 },

  // Other
  { name: 'Dark chocolate (70%+)', nutrients: ['coq10', 'zinc'], score: 2 },
  { name: 'Nutritional yeast (fortified)', nutrients: ['b12'], score: 2 },
  { name: 'Fortified dairy', nutrients: ['vitaminD'], score: 2 },
  { name: 'Legumes (soaked/sprouted)', nutrients: ['zinc'], score: 2 },
];

export function foodsForNutrient(nutrient: NutrientId): MitoFood[] {
  return MITO_FOODS.filter((f) => f.nutrients.includes(nutrient));
}

// Keyword fallback so typed/custom foods still count toward nutrient coverage.
const NUTRIENT_KEYWORDS: Record<NutrientId, string[]> = {
  coq10: ['liver', 'heart', 'kidney', 'organ meat', 'sardine', 'mackerel', 'salmon', 'beef', 'pork', 'dark meat', 'chicken thigh', 'sesame', 'pistachio', 'broccoli', 'cauliflower', 'dark chocolate'],
  omega3: ['salmon', 'sardine', 'anchov', 'herring', 'mackerel', 'roe', 'caviar', 'walnut', 'flax', 'chia', 'hemp seed', 'algae', 'purslane', 'cod liver', 'egg'],
  b12: ['clam', 'mussel', 'oyster', 'liver', 'sardine', 'salmon', 'tuna', 'nutritional yeast', 'beef', 'egg'],
  vitaminD: ['salmon', 'mackerel', 'sardine', 'cod liver', 'egg', 'mushroom', 'maitake', 'portobello', 'fortified'],
  ala: ['beef', 'lamb', 'red meat', 'liver', 'heart', 'kidney', 'organ meat', 'spinach', 'broccoli', 'tomato', 'brussels', 'peas', 'rice bran'],
  zinc: ['oyster', 'beef', 'lamb', 'pumpkin seed', 'sesame', 'chicken', 'turkey', 'cashew', 'pine nut', 'dark chocolate', 'legume', 'lentil', 'bean', 'chickpea'],
};

export function matchNutrients(foodName: string): NutrientId[] {
  const lower = foodName.toLowerCase();
  return NUTRIENT_CATEGORIES.filter((c) =>
    NUTRIENT_KEYWORDS[c.id].some((kw) => lower.includes(kw))
  ).map((c) => c.id);
}

// How many of the six nutrients the given food items cover, and which.
export function computeNutrientCoverage(items: FoodItem[]): {
  covered: NutrientId[];
  missing: NutrientId[];
  percent: number;
} {
  const coveredSet = new Set<NutrientId>();
  items.forEach((item) => {
    const nutrients =
      item.nutrients && item.nutrients.length > 0
        ? (item.nutrients as NutrientId[])
        : matchNutrients(item.name);
    nutrients.forEach((n) => coveredSet.add(n));
  });

  const covered = NUTRIENT_CATEGORIES.filter((c) => coveredSet.has(c.id)).map((c) => c.id);
  const missing = NUTRIENT_CATEGORIES.filter((c) => !coveredSet.has(c.id)).map((c) => c.id);
  return {
    covered,
    missing,
    percent: Math.round((covered.length / NUTRIENT_CATEGORIES.length) * 100),
  };
}

// A few example foods to suggest for a missing nutrient.
export function suggestionsFor(nutrient: NutrientId, max = 3): string[] {
  return foodsForNutrient(nutrient)
    .filter((f) => f.score >= 3)
    .slice(0, max)
    .map((f) => f.name);
}
