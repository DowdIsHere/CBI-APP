import { Trigger } from '../data/types';

// Label/ingredient safety checking.
// The camera no longer logs meals — it scans product barcodes and flags
// harmful ingredients plus anything matching the user's allergy/sensitivity triggers.

export interface SafetyFlag {
  term: string;   // what matched, as shown to the user
  reason: string; // why it's flagged
}

export interface LabelCheckResult {
  success: boolean;
  error?: string;
  productName?: string;
  brand?: string;
  ingredientsText?: string;
  harmful: SafetyFlag[];
  allergyHits: SafetyFlag[];
  sensitivityHits: SafetyFlag[];
  verdict: 'avoid' | 'caution' | 'clear';
}

// Ingredients broadly worth flagging regardless of personal triggers.
const HARMFUL_INGREDIENTS: { label: string; reason: string; matches: string[] }[] = [
  { label: 'Seed oils', reason: 'Inflammatory industrial seed oil', matches: ['canola', 'rapeseed', 'soybean oil', 'soy oil', 'corn oil', 'cottonseed', 'sunflower oil', 'safflower oil', 'grapeseed oil', 'vegetable oil'] },
  { label: 'Trans fats', reason: 'Damages mitochondrial membranes', matches: ['partially hydrogenated', 'hydrogenated oil', 'shortening'] },
  { label: 'Added sugars', reason: 'High-glycemic refined sweetener', matches: ['high fructose corn syrup', 'corn syrup', 'glucose-fructose', 'glucose syrup', 'invert sugar'] },
  { label: 'Artificial sweeteners', reason: 'May disrupt gut microbiome', matches: ['aspartame', 'sucralose', 'acesulfame', 'saccharin'] },
  { label: 'MSG', reason: 'Flavor enhancer some people react to', matches: ['monosodium glutamate', 'msg', 'yeast extract', 'hydrolyzed protein'] },
  { label: 'Nitrites/nitrates', reason: 'Processed-meat preservative', matches: ['sodium nitrite', 'sodium nitrate', 'potassium nitrite', 'potassium nitrate'] },
  { label: 'Synthetic preservatives', reason: 'Synthetic antioxidant preservative', matches: ['bha', 'bht', 'tbhq', 'sodium benzoate', 'potassium sorbate'] },
  { label: 'Carrageenan', reason: 'Thickener that may irritate the gut', matches: ['carrageenan'] },
  { label: 'Artificial dyes', reason: 'Artificial coloring', matches: ['red 40', 'red no. 40', 'red 3', 'yellow 5', 'yellow 6', 'blue 1', 'blue 2', 'tartrazine', 'artificial color'] },
  { label: 'Controversial additives', reason: 'Banned or restricted in some countries', matches: ['titanium dioxide', 'potassium bromate', 'brominated vegetable oil', 'azodicarbonamide'] },
  { label: 'Processed starches', reason: 'Highly processed filler', matches: ['maltodextrin'] },
];

// Maps common trigger names to ingredient words that indicate their presence.
const TRIGGER_SYNONYMS: Record<string, string[]> = {
  dairy: ['milk', 'cream', 'butter', 'cheese', 'whey', 'casein', 'lactose', 'yogurt', 'ghee'],
  gluten: ['wheat', 'barley', 'rye', 'malt', 'spelt', 'semolina', 'farro', 'gluten'],
  wheat: ['wheat', 'semolina', 'spelt', 'farina'],
  shellfish: ['shrimp', 'prawn', 'crab', 'lobster', 'oyster', 'clam', 'mussel', 'scallop', 'crustacean', 'mollusc', 'mollusk', 'shellfish'],
  'tree nuts': ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'macadamia', 'brazil nut', 'tree nut'],
  peanuts: ['peanut', 'groundnut'],
  peanut: ['peanut', 'groundnut'],
  eggs: ['egg', 'albumin', 'albumen'],
  egg: ['egg', 'albumin', 'albumen'],
  soy: ['soy', 'soya', 'edamame', 'tofu', 'tempeh'],
  fish: ['fish', 'salmon', 'tuna', 'sardine', 'anchovy', 'cod', 'pollock', 'tilapia'],
  sesame: ['sesame', 'tahini'],
  corn: ['corn', 'maize'],
  nightshades: ['tomato', 'potato', 'pepper', 'paprika', 'eggplant', 'aubergine', 'capsicum', 'chili', 'chilli', 'cayenne'],
};

function synonymsForTrigger(triggerName: string): string[] {
  const key = triggerName.toLowerCase();
  return TRIGGER_SYNONYMS[key] || [key];
}

// Check free text (ingredient list or a food name) against the user's triggers.
export function matchTriggersToText(
  text: string,
  triggers: Trigger[]
): { allergyHits: SafetyFlag[]; sensitivityHits: SafetyFlag[] } {
  const lower = text.toLowerCase();
  const allergyHits: SafetyFlag[] = [];
  const sensitivityHits: SafetyFlag[] = [];

  triggers.forEach((trigger) => {
    const matched = synonymsForTrigger(trigger.name).find((syn) => lower.includes(syn));
    if (!matched) return;

    const flag: SafetyFlag = {
      term: matched === trigger.name.toLowerCase() ? trigger.name : `${matched} (${trigger.name})`,
      reason:
        trigger.category === 'Allergy'
          ? `Matches your ${trigger.name} allergy`
          : `Matches your ${trigger.name} ${trigger.category === 'Sensitivity' ? 'sensitivity' : 'trigger'}`,
    };

    if (trigger.category === 'Allergy') {
      allergyHits.push(flag);
    } else {
      sensitivityHits.push(flag);
    }
  });

  return { allergyHits, sensitivityHits };
}

// Convenience for food names picked/typed in the meal builder.
export function triggerWarningsForFood(foodName: string, triggers: Trigger[]): string[] {
  const { allergyHits, sensitivityHits } = matchTriggersToText(foodName, triggers);
  return [...allergyHits, ...sensitivityHits].map((f) => f.reason);
}

function findHarmfulIngredients(text: string): SafetyFlag[] {
  const lower = text.toLowerCase();
  const flags: SafetyFlag[] = [];
  HARMFUL_INGREDIENTS.forEach((entry) => {
    const matched = entry.matches.find((m) => lower.includes(m));
    if (matched) {
      flags.push({ term: `${entry.label}: ${matched}`, reason: entry.reason });
    }
  });
  return flags;
}

// Scan a product barcode and produce a safety report for its label.
export async function checkProductSafety(
  barcode: string,
  triggers: Trigger[]
): Promise<LabelCheckResult> {
  const empty = { harmful: [], allergyHits: [], sensitivityHits: [] };
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    if (!response.ok) {
      return { success: false, error: 'Product not found', verdict: 'caution', ...empty };
    }

    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      return {
        success: false,
        error: 'Product not found in database',
        verdict: 'caution',
        ...empty,
      };
    }

    const product = data.product;
    const ingredientsText: string =
      product.ingredients_text_en || product.ingredients_text || '';

    // Combine the ingredient list with the product's declared allergen tags
    // so trigger matching catches both.
    const allergenText = (product.allergens_tags || [])
      .map((a: string) => a.replace('en:', '').replace(/-/g, ' '))
      .join(', ');
    const searchText = `${ingredientsText} ${allergenText} ${product.product_name || ''}`;

    const harmful = findHarmfulIngredients(searchText);
    const { allergyHits, sensitivityHits } = matchTriggersToText(searchText, triggers);

    let verdict: LabelCheckResult['verdict'] = 'clear';
    if (allergyHits.length > 0) verdict = 'avoid';
    else if (harmful.length > 0 || sensitivityHits.length > 0) verdict = 'caution';

    return {
      success: true,
      productName: product.product_name || 'Unknown product',
      brand: product.brands || undefined,
      ingredientsText: ingredientsText || undefined,
      harmful,
      allergyHits,
      sensitivityHits,
      verdict,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Could not look up that barcode. Check your connection and try again.',
      verdict: 'caution',
      ...empty,
    };
  }
}
