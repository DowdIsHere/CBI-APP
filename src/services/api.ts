import { supabase } from '../lib/supabase';
import { DetectedFood, FoodItem, BatchContainer } from '../types';

// ============================================================
// PHOTO ANALYSIS
// ============================================================

export interface PhotoAnalysisResult {
  foods: {
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
  }[];
  meal_notes: string;
}

export async function analyzePhoto(
  imageBase64: string,
  userTriggers?: string[]
): Promise<PhotoAnalysisResult> {
  const { data, error } = await supabase.functions.invoke('analyze-photo', {
    body: {
      image_base64: imageBase64,
      user_triggers: userTriggers || [],
    },
  });

  if (error) throw new Error(error.message || 'Photo analysis failed');
  return data as PhotoAnalysisResult;
}

/**
 * Convert photo analysis result to DetectedFood[] for the UI
 */
export function photoResultToDetectedFoods(
  result: PhotoAnalysisResult
): DetectedFood[] {
  return result.foods.map((food, index) => ({
    id: Date.now() + index,
    name: food.name,
    portionSize: food.portion_size,
    score: food.inflammation_score,
    warnings: food.warnings,
  }));
}

// ============================================================
// BARCODE SCANNING
// ============================================================

export interface BarcodeScanResult {
  source: string;
  food: {
    name: string;
    brand?: string;
    barcode: string;
    inflammation_score: number;
    ingredients: string[];
    nutrients: {
      calories?: number;
      net_carbs?: number;
      protein?: number;
      fat?: number;
      fiber?: number;
    };
    warnings: string[];
    triggers_detected: {
      trigger: string;
      ingredient: string;
      warning: string;
    }[];
  };
  error?: string;
  suggestion?: string;
}

export async function scanBarcode(
  barcode: string,
  userTriggers?: string[]
): Promise<BarcodeScanResult> {
  const { data, error } = await supabase.functions.invoke('scan-barcode', {
    body: {
      barcode,
      user_triggers: userTriggers || [],
    },
  });

  if (error) throw new Error(error.message || 'Barcode scan failed');

  // Handle 404 - product not found
  if (data?.error === 'Product not found') {
    throw new Error(`Product not found for barcode ${barcode}. ${data.suggestion || ''}`);
  }

  return data as BarcodeScanResult;
}

/**
 * Convert barcode result to DetectedFood for the UI
 */
export function barcodeResultToDetectedFood(
  result: BarcodeScanResult
): FoodItem {
  return {
    id: Date.now(),
    name: result.food.name,
    brand: result.food.brand,
    upc: result.food.barcode,
    servingSize: '1 serving',
    score: result.food.inflammation_score,
    warnings: result.food.warnings,
  };
}

// ============================================================
// MEAL CALCULATION
// ============================================================

export interface MealCalculationResult {
  total_inflammation_score: number;
  total_calories: number;
  total_net_carbs: number;
  total_protein: number;
  total_fat: number;
  synergy_bonuses: {
    name: string;
    foods: string[];
    bonus: number;
    reason: string;
  }[];
  carb_adjustment: number;
  phase_appropriate: boolean;
  meets_target: boolean;
  recommendations: string[];
  food_count: number;
}

export async function calculateMeal(
  foods: { name: string; inflammation_score: number; portion_size?: string; nutrients?: Record<string, number> }[],
  currentPhase?: number
): Promise<MealCalculationResult> {
  const { data, error } = await supabase.functions.invoke('calculate-meal', {
    body: {
      foods,
      current_phase: currentPhase || 1,
    },
  });

  if (error) throw new Error(error.message || 'Meal calculation failed');
  return data as MealCalculationResult;
}

// ============================================================
// TRIGGER CHECKING
// ============================================================

export interface TriggerCheckResult {
  detected: {
    trigger_name: string;
    severity: string;
    matched_ingredient: string;
    symptoms: string[];
  }[];
  severity_level: 'safe' | 'caution' | 'warning' | 'danger';
  food_name: string;
  total_triggers_found: number;
  message: string;
}

export async function checkTriggers(
  ingredients: string[],
  foodName?: string
): Promise<TriggerCheckResult> {
  const { data, error } = await supabase.functions.invoke('check-triggers', {
    body: {
      ingredients,
      food_name: foodName || 'Unknown',
    },
  });

  if (error) throw new Error(error.message || 'Trigger check failed');
  return data as TriggerCheckResult;
}

// ============================================================
// USER TRIGGERS MANAGEMENT
// ============================================================

export async function getUserTriggers(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_triggers')
    .select('trigger_name, ingredient_patterns')
    .eq('user_id', user.id);

  if (error || !data) return [];

  // Flatten all patterns into a single trigger list
  return data.flatMap((t) => t.ingredient_patterns || []);
}

export async function addUserTrigger(trigger: {
  trigger_name: string;
  ingredient_patterns: string[];
  severity: 'mild' | 'moderate' | 'severe';
  symptoms?: string[];
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('user_triggers').upsert(
    {
      user_id: user.id,
      ...trigger,
    },
    { onConflict: 'user_id,trigger_name' }
  );

  if (error) throw error;
}

export async function removeUserTrigger(triggerName: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('user_triggers')
    .delete()
    .eq('user_id', user.id)
    .eq('trigger_name', triggerName);

  if (error) throw error;
}

// ============================================================
// UTILITY: Convert image URI to base64
// ============================================================

export async function imageUriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
