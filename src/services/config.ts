// API Configuration
// API key is loaded from environment variables via app.config.js
import Constants from 'expo-constants';

export const API_CONFIG = {
  ANTHROPIC_API_KEY: Constants.expoConfig?.extra?.anthropicApiKey || '',
  ANTHROPIC_API_URL: 'https://api.anthropic.com/v1/messages',
  MODEL: 'claude-sonnet-4-20250514',
};

// Food scoring criteria based on JD Mercer Protocol
export const SCORING_CRITERIA = {
  // Foods that support ENS health score higher
  HIGH_SCORE_KEYWORDS: [
    'salmon', 'sardines', 'mackerel', 'herring', 'anchovies', // omega-3 rich fish
    'olive oil', 'avocado', 'nuts', 'seeds', // healthy fats
    'leafy greens', 'spinach', 'kale', 'broccoli', 'asparagus', // vegetables
    'berries', 'blueberries', // antioxidants
    'fermented', 'kimchi', 'sauerkraut', 'yogurt', 'kefir', // probiotics
    'bone broth', 'collagen', // gut healing
    'turmeric', 'ginger', // anti-inflammatory
    'eggs', 'grass-fed', 'pasture-raised', // quality proteins
  ],
  // Foods that may stress the ENS score lower
  LOW_SCORE_KEYWORDS: [
    'processed', 'refined', 'artificial', 'preservatives',
    'sugar', 'high fructose', 'corn syrup',
    'seed oil', 'vegetable oil', 'canola', 'soybean oil',
    'gluten', 'wheat', // for sensitive individuals
    'fried', 'deep fried',
    'fast food', 'junk food',
  ],
};
