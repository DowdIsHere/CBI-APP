/**
 * Food Database Seed Script
 *
 * Run with: npx ts-node scripts/seed-foods.ts
 * Or via Supabase SQL editor (see SQL version at bottom)
 *
 * Seeds ~50 essential Dowd Protocol foods with inflammation scores
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

interface SeedFood {
  name: string;
  category: string;
  base_inflammation_score: number;
  calories_per_100g?: number;
  net_carbs_per_100g?: number;
  protein_per_100g?: number;
  fat_per_100g?: number;
  fiber_per_100g?: number;
  tags: string[];
  source: string;
  verified: boolean;
}

const foods: SeedFood[] = [
  // === TIER 1: Anti-Inflammatory Superfoods (+3) ===
  { name: 'Wild-Caught Salmon', category: 'protein', base_inflammation_score: 3, calories_per_100g: 208, net_carbs_per_100g: 0, protein_per_100g: 20, fat_per_100g: 13, fiber_per_100g: 0, tags: ['omega-3', 'wild-caught', 'fatty-fish'], source: 'dowd-protocol', verified: true },
  { name: 'Wild Sardines', category: 'protein', base_inflammation_score: 3, calories_per_100g: 208, net_carbs_per_100g: 0, protein_per_100g: 25, fat_per_100g: 11, fiber_per_100g: 0, tags: ['omega-3', 'wild-caught', 'fatty-fish'], source: 'dowd-protocol', verified: true },
  { name: 'Wild Mackerel', category: 'protein', base_inflammation_score: 3, calories_per_100g: 205, net_carbs_per_100g: 0, protein_per_100g: 19, fat_per_100g: 14, fiber_per_100g: 0, tags: ['omega-3', 'wild-caught', 'fatty-fish'], source: 'dowd-protocol', verified: true },
  { name: 'Anchovies', category: 'protein', base_inflammation_score: 3, calories_per_100g: 131, net_carbs_per_100g: 0, protein_per_100g: 20, fat_per_100g: 5, fiber_per_100g: 0, tags: ['omega-3', 'fatty-fish'], source: 'dowd-protocol', verified: true },
  { name: 'Bone Broth', category: 'protein', base_inflammation_score: 3, calories_per_100g: 15, net_carbs_per_100g: 0, protein_per_100g: 3, fat_per_100g: 0.2, fiber_per_100g: 0, tags: ['gut-healing', 'collagen'], source: 'dowd-protocol', verified: true },

  // === TIER 2: Strong Anti-Inflammatory (+2) ===
  { name: 'Broccoli', category: 'vegetable', base_inflammation_score: 2, calories_per_100g: 34, net_carbs_per_100g: 4, protein_per_100g: 2.8, fat_per_100g: 0.4, fiber_per_100g: 2.6, tags: ['cruciferous', 'sulforaphane'], source: 'dowd-protocol', verified: true },
  { name: 'Kale', category: 'vegetable', base_inflammation_score: 2, calories_per_100g: 49, net_carbs_per_100g: 6, protein_per_100g: 4.3, fat_per_100g: 0.9, fiber_per_100g: 3.6, tags: ['cruciferous', 'leafy-green'], source: 'dowd-protocol', verified: true },
  { name: 'Cauliflower', category: 'vegetable', base_inflammation_score: 2, calories_per_100g: 25, net_carbs_per_100g: 3, protein_per_100g: 1.9, fat_per_100g: 0.3, fiber_per_100g: 2, tags: ['cruciferous', 'low-carb'], source: 'dowd-protocol', verified: true },
  { name: 'Brussels Sprouts', category: 'vegetable', base_inflammation_score: 2, calories_per_100g: 43, net_carbs_per_100g: 5, protein_per_100g: 3.4, fat_per_100g: 0.3, fiber_per_100g: 3.8, tags: ['cruciferous'], source: 'dowd-protocol', verified: true },
  { name: 'Cabbage', category: 'vegetable', base_inflammation_score: 2, calories_per_100g: 25, net_carbs_per_100g: 3, protein_per_100g: 1.3, fat_per_100g: 0.1, fiber_per_100g: 2.5, tags: ['cruciferous'], source: 'dowd-protocol', verified: true },
  { name: 'Arugula', category: 'vegetable', base_inflammation_score: 2, calories_per_100g: 25, net_carbs_per_100g: 2, protein_per_100g: 2.6, fat_per_100g: 0.7, fiber_per_100g: 1.6, tags: ['cruciferous', 'leafy-green'], source: 'dowd-protocol', verified: true },
  { name: 'Blueberries', category: 'fruit', base_inflammation_score: 2, calories_per_100g: 57, net_carbs_per_100g: 12, protein_per_100g: 0.7, fat_per_100g: 0.3, fiber_per_100g: 2.4, tags: ['antioxidant', 'berry'], source: 'dowd-protocol', verified: true },
  { name: 'Blackberries', category: 'fruit', base_inflammation_score: 2, calories_per_100g: 43, net_carbs_per_100g: 5, protein_per_100g: 1.4, fat_per_100g: 0.5, fiber_per_100g: 5.3, tags: ['antioxidant', 'berry', 'low-carb'], source: 'dowd-protocol', verified: true },
  { name: 'Raspberries', category: 'fruit', base_inflammation_score: 2, calories_per_100g: 52, net_carbs_per_100g: 5, protein_per_100g: 1.2, fat_per_100g: 0.7, fiber_per_100g: 6.5, tags: ['antioxidant', 'berry', 'low-carb'], source: 'dowd-protocol', verified: true },
  { name: 'Avocado', category: 'fruit', base_inflammation_score: 2, calories_per_100g: 160, net_carbs_per_100g: 2, protein_per_100g: 2, fat_per_100g: 15, fiber_per_100g: 7, tags: ['healthy-fat', 'potassium'], source: 'dowd-protocol', verified: true },
  { name: 'Extra Virgin Olive Oil', category: 'fat', base_inflammation_score: 2, calories_per_100g: 884, net_carbs_per_100g: 0, protein_per_100g: 0, fat_per_100g: 100, fiber_per_100g: 0, tags: ['healthy-fat', 'polyphenol'], source: 'dowd-protocol', verified: true },
  { name: 'Turmeric', category: 'spice', base_inflammation_score: 2, calories_per_100g: 312, net_carbs_per_100g: 55, protein_per_100g: 10, fat_per_100g: 3, fiber_per_100g: 22, tags: ['curcumin', 'anti-inflammatory'], source: 'dowd-protocol', verified: true },
  { name: 'Ginger', category: 'spice', base_inflammation_score: 2, calories_per_100g: 80, net_carbs_per_100g: 16, protein_per_100g: 1.8, fat_per_100g: 0.8, fiber_per_100g: 2, tags: ['anti-inflammatory', 'digestive'], source: 'dowd-protocol', verified: true },
  { name: 'Kimchi', category: 'fermented', base_inflammation_score: 2, calories_per_100g: 15, net_carbs_per_100g: 1, protein_per_100g: 1.1, fat_per_100g: 0.5, fiber_per_100g: 1.6, tags: ['probiotic', 'fermented', 'gut-healing'], source: 'dowd-protocol', verified: true },
  { name: 'Sauerkraut', category: 'fermented', base_inflammation_score: 2, calories_per_100g: 19, net_carbs_per_100g: 1, protein_per_100g: 0.9, fat_per_100g: 0.1, fiber_per_100g: 2.9, tags: ['probiotic', 'fermented', 'gut-healing'], source: 'dowd-protocol', verified: true },
  { name: 'Walnuts', category: 'nut', base_inflammation_score: 2, calories_per_100g: 654, net_carbs_per_100g: 7, protein_per_100g: 15, fat_per_100g: 65, fiber_per_100g: 6.7, tags: ['omega-3', 'healthy-fat'], source: 'dowd-protocol', verified: true },
  { name: 'Flaxseeds', category: 'seed', base_inflammation_score: 2, calories_per_100g: 534, net_carbs_per_100g: 2, protein_per_100g: 18, fat_per_100g: 42, fiber_per_100g: 27, tags: ['omega-3', 'fiber'], source: 'dowd-protocol', verified: true },
  { name: 'Chia Seeds', category: 'seed', base_inflammation_score: 2, calories_per_100g: 486, net_carbs_per_100g: 8, protein_per_100g: 17, fat_per_100g: 31, fiber_per_100g: 34, tags: ['omega-3', 'fiber'], source: 'dowd-protocol', verified: true },
  { name: 'Spinach', category: 'vegetable', base_inflammation_score: 2, calories_per_100g: 23, net_carbs_per_100g: 1.4, protein_per_100g: 2.9, fat_per_100g: 0.4, fiber_per_100g: 2.2, tags: ['leafy-green', 'iron'], source: 'dowd-protocol', verified: true },
  { name: 'Sweet Potato', category: 'vegetable', base_inflammation_score: 2, calories_per_100g: 86, net_carbs_per_100g: 17, protein_per_100g: 1.6, fat_per_100g: 0.1, fiber_per_100g: 3, tags: ['complex-carb', 'vitamin-a'], source: 'dowd-protocol', verified: true },

  // === TIER 3: Beneficial (+1) ===
  { name: 'Pasture-Raised Eggs', category: 'protein', base_inflammation_score: 1, calories_per_100g: 155, net_carbs_per_100g: 1.1, protein_per_100g: 13, fat_per_100g: 11, fiber_per_100g: 0, tags: ['complete-protein', 'choline'], source: 'dowd-protocol', verified: true },
  { name: 'Grass-Fed Beef', category: 'protein', base_inflammation_score: 1, calories_per_100g: 250, net_carbs_per_100g: 0, protein_per_100g: 26, fat_per_100g: 15, fiber_per_100g: 0, tags: ['complete-protein', 'iron', 'b12'], source: 'dowd-protocol', verified: true },
  { name: 'Organic Chicken Breast', category: 'protein', base_inflammation_score: 1, calories_per_100g: 165, net_carbs_per_100g: 0, protein_per_100g: 31, fat_per_100g: 3.6, fiber_per_100g: 0, tags: ['lean-protein'], source: 'dowd-protocol', verified: true },
  { name: 'Wild Turkey', category: 'protein', base_inflammation_score: 1, calories_per_100g: 135, net_carbs_per_100g: 0, protein_per_100g: 30, fat_per_100g: 1, fiber_per_100g: 0, tags: ['lean-protein'], source: 'dowd-protocol', verified: true },
  { name: 'Lamb', category: 'protein', base_inflammation_score: 1, calories_per_100g: 294, net_carbs_per_100g: 0, protein_per_100g: 25, fat_per_100g: 21, fiber_per_100g: 0, tags: ['complete-protein'], source: 'dowd-protocol', verified: true },
  { name: 'Quinoa', category: 'grain', base_inflammation_score: 1, calories_per_100g: 120, net_carbs_per_100g: 19, protein_per_100g: 4.4, fat_per_100g: 1.9, fiber_per_100g: 2.8, tags: ['complete-protein', 'gluten-free'], source: 'dowd-protocol', verified: true },
  { name: 'Brown Rice', category: 'grain', base_inflammation_score: 1, calories_per_100g: 123, net_carbs_per_100g: 24, protein_per_100g: 2.7, fat_per_100g: 1, fiber_per_100g: 1.8, tags: ['whole-grain', 'gluten-free'], source: 'dowd-protocol', verified: true },
  { name: 'Lentils', category: 'legume', base_inflammation_score: 1, calories_per_100g: 116, net_carbs_per_100g: 12, protein_per_100g: 9, fat_per_100g: 0.4, fiber_per_100g: 7.9, tags: ['fiber', 'plant-protein'], source: 'dowd-protocol', verified: true },
  { name: 'Coconut Oil', category: 'fat', base_inflammation_score: 1, calories_per_100g: 862, net_carbs_per_100g: 0, protein_per_100g: 0, fat_per_100g: 100, fiber_per_100g: 0, tags: ['mct', 'healthy-fat'], source: 'dowd-protocol', verified: true },
  { name: 'Ghee', category: 'fat', base_inflammation_score: 1, calories_per_100g: 876, net_carbs_per_100g: 0, protein_per_100g: 0, fat_per_100g: 100, fiber_per_100g: 0, tags: ['healthy-fat', 'butyrate'], source: 'dowd-protocol', verified: true },
  { name: 'Asparagus', category: 'vegetable', base_inflammation_score: 1, calories_per_100g: 20, net_carbs_per_100g: 2, protein_per_100g: 2.2, fat_per_100g: 0.1, fiber_per_100g: 2.1, tags: ['prebiotic'], source: 'dowd-protocol', verified: true },
  { name: 'Green Beans', category: 'vegetable', base_inflammation_score: 1, calories_per_100g: 31, net_carbs_per_100g: 4, protein_per_100g: 1.8, fat_per_100g: 0.1, fiber_per_100g: 3.4, tags: ['fiber'], source: 'dowd-protocol', verified: true },
  { name: 'Zucchini', category: 'vegetable', base_inflammation_score: 1, calories_per_100g: 17, net_carbs_per_100g: 2, protein_per_100g: 1.2, fat_per_100g: 0.3, fiber_per_100g: 1, tags: ['low-carb'], source: 'dowd-protocol', verified: true },
  { name: 'Almonds', category: 'nut', base_inflammation_score: 1, calories_per_100g: 579, net_carbs_per_100g: 9, protein_per_100g: 21, fat_per_100g: 50, fiber_per_100g: 12.5, tags: ['vitamin-e', 'healthy-fat'], source: 'dowd-protocol', verified: true },

  // === NEGATIVE SCORES: Inflammatory Foods ===
  { name: 'White Bread', category: 'grain', base_inflammation_score: -1, calories_per_100g: 265, net_carbs_per_100g: 47, protein_per_100g: 9, fat_per_100g: 3.2, fiber_per_100g: 2.7, tags: ['refined', 'gluten'], source: 'dowd-protocol', verified: true },
  { name: 'Conventional Yogurt (Flavored)', category: 'dairy', base_inflammation_score: -1, calories_per_100g: 99, net_carbs_per_100g: 17, protein_per_100g: 4, fat_per_100g: 1, fiber_per_100g: 0, tags: ['added-sugar', 'conventional-dairy'], source: 'dowd-protocol', verified: true },
  { name: 'French Fries', category: 'processed', base_inflammation_score: -2, calories_per_100g: 312, net_carbs_per_100g: 38, protein_per_100g: 3.4, fat_per_100g: 15, fiber_per_100g: 3.8, tags: ['seed-oil', 'fried'], source: 'dowd-protocol', verified: true },
  { name: 'Hot Dog', category: 'processed', base_inflammation_score: -2, calories_per_100g: 290, net_carbs_per_100g: 2, protein_per_100g: 10, fat_per_100g: 26, fiber_per_100g: 0, tags: ['nitrates', 'processed-meat'], source: 'dowd-protocol', verified: true },
  { name: 'Soda (Cola)', category: 'beverage', base_inflammation_score: -2, calories_per_100g: 42, net_carbs_per_100g: 11, protein_per_100g: 0, fat_per_100g: 0, fiber_per_100g: 0, tags: ['hfcs', 'added-sugar'], source: 'dowd-protocol', verified: true },
  { name: 'Margarine', category: 'fat', base_inflammation_score: -3, calories_per_100g: 717, net_carbs_per_100g: 1, protein_per_100g: 1, fat_per_100g: 80, fiber_per_100g: 0, tags: ['seed-oil', 'trans-fat'], source: 'dowd-protocol', verified: true },
  { name: 'Doritos', category: 'processed', base_inflammation_score: -3, calories_per_100g: 490, net_carbs_per_100g: 58, protein_per_100g: 6, fat_per_100g: 25, fiber_per_100g: 3, tags: ['seed-oil', 'msg', 'artificial-color'], source: 'dowd-protocol', verified: true },
  { name: 'Diet Soda', category: 'beverage', base_inflammation_score: -2, calories_per_100g: 0, net_carbs_per_100g: 0, protein_per_100g: 0, fat_per_100g: 0, fiber_per_100g: 0, tags: ['artificial-sweetener', 'aspartame'], source: 'dowd-protocol', verified: true },
];

async function seedFoods() {
  console.log(`Seeding ${foods.length} foods...`);

  for (const food of foods) {
    const { error } = await supabase.from('foods').upsert(food, {
      onConflict: 'name',
    });

    if (error) {
      console.error(`Failed to seed "${food.name}":`, error.message);
    } else {
      console.log(`  ✓ ${food.name} (score: ${food.base_inflammation_score})`);
    }
  }

  console.log('\nSeeding complete!');
}

seedFoods().catch(console.error);

/*
 * ================================================================
 * SQL VERSION (paste into Supabase SQL Editor if you prefer):
 * ================================================================
 *
 * INSERT INTO foods (name, category, base_inflammation_score, calories_per_100g, net_carbs_per_100g, protein_per_100g, fat_per_100g, fiber_per_100g, tags, source, verified)
 * VALUES
 *   ('Wild-Caught Salmon', 'protein', 3, 208, 0, 20, 13, 0, ARRAY['omega-3','wild-caught','fatty-fish'], 'dowd-protocol', true),
 *   ('Wild Sardines', 'protein', 3, 208, 0, 25, 11, 0, ARRAY['omega-3','wild-caught','fatty-fish'], 'dowd-protocol', true),
 *   ('Broccoli', 'vegetable', 2, 34, 4, 2.8, 0.4, 2.6, ARRAY['cruciferous','sulforaphane'], 'dowd-protocol', true),
 *   ('Avocado', 'fruit', 2, 160, 2, 2, 15, 7, ARRAY['healthy-fat','potassium'], 'dowd-protocol', true),
 *   ('Extra Virgin Olive Oil', 'fat', 2, 884, 0, 0, 100, 0, ARRAY['healthy-fat','polyphenol'], 'dowd-protocol', true)
 * ON CONFLICT (name) DO NOTHING;
 *
 * (Use the full food list above for complete seeding)
 */
