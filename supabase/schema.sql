-- CBI App Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This is safe to re-run: uses IF NOT EXISTS and DROP POLICY IF EXISTS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (linked to auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  condition TEXT DEFAULT '',
  join_date TEXT DEFAULT '',
  allergies JSONB DEFAULT '[]'::jsonb,
  sensitivities JSONB DEFAULT '[]'::jsonb,
  -- Extended profile fields
  health_goals TEXT[],
  autoimmune_conditions TEXT[],
  dietary_restrictions TEXT[],
  current_phase INTEGER CHECK (current_phase IN (1, 2, 3)) DEFAULT 1,
  target_daily_score INTEGER DEFAULT 12,
  net_carb_limit INTEGER DEFAULT 20,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  notification_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MEALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS meals (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_score INTEGER NOT NULL DEFAULT 0,
  method TEXT NOT NULL CHECK (method IN ('photo', 'batch', 'barcode', 'manual')),
  -- Extended meal fields
  total_net_carbs NUMERIC(10,2),
  total_protein NUMERIC(10,2),
  total_calories NUMERIC(10,2),
  synergy_bonuses JSONB,
  phase_appropriate BOOLEAN,
  recommendations TEXT[],
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meals_score ON meals(total_score);

-- =====================================================
-- FOODS DATABASE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  barcode TEXT UNIQUE,
  brand TEXT,
  category TEXT,
  ingredients TEXT[],
  ingredients_text TEXT,
  base_inflammation_score INTEGER NOT NULL,
  calories_per_100g NUMERIC(10,2),
  net_carbs_per_100g NUMERIC(10,2),
  protein_per_100g NUMERIC(10,2),
  fat_per_100g NUMERIC(10,2),
  fiber_per_100g NUMERIC(10,2),
  hidden_nutrients JSONB,
  tags TEXT[],
  cooking_methods JSONB,
  source TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_foods_barcode ON foods(barcode);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_score ON foods(base_inflammation_score);

-- =====================================================
-- USER TRIGGERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trigger_name TEXT NOT NULL,
  ingredient_patterns TEXT[] NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')) DEFAULT 'moderate',
  symptoms TEXT[],
  last_reaction_date DATE,
  reaction_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trigger_name)
);

CREATE INDEX IF NOT EXISTS idx_user_triggers_user_id ON user_triggers(user_id);

-- =====================================================
-- EDUCATIONAL LESSONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_number INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  estimated_read_time INTEGER,
  key_takeaways TEXT[],
  image_url TEXT,
  video_url TEXT,
  related_lessons UUID[],
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_number, lesson_number)
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_number, lesson_number);

-- =====================================================
-- USER LESSON PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,
  user_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id);

-- =====================================================
-- DAILY SUMMARIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  summary_date DATE NOT NULL,
  total_meals INTEGER DEFAULT 0,
  avg_inflammation_score NUMERIC(10,2),
  total_net_carbs NUMERIC(10,2),
  total_protein NUMERIC(10,2),
  total_calories NUMERIC(10,2),
  met_score_target BOOLEAN,
  met_carb_limit BOOLEAN,
  consecutive_days_on_protocol INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, summary_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_date ON daily_summaries(user_id, summary_date);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_date_desc ON daily_summaries(user_id, summary_date DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Meals policies
DROP POLICY IF EXISTS "Users can view own meals" ON meals;
CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own meals" ON meals;
CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own meals" ON meals;
CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own meals" ON meals;
CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Foods policies (public read for anon + authenticated)
DROP POLICY IF EXISTS "Anyone can read foods" ON foods;
CREATE POLICY "Anyone can read foods"
  ON foods FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow edge functions (service role) to insert/update foods
DROP POLICY IF EXISTS "Service can manage foods" ON foods;
CREATE POLICY "Service can manage foods"
  ON foods FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- User Triggers policies
DROP POLICY IF EXISTS "Users can view own triggers" ON user_triggers;
CREATE POLICY "Users can view own triggers"
  ON user_triggers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own triggers" ON user_triggers;
CREATE POLICY "Users can insert own triggers"
  ON user_triggers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own triggers" ON user_triggers;
CREATE POLICY "Users can update own triggers"
  ON user_triggers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own triggers" ON user_triggers;
CREATE POLICY "Users can delete own triggers"
  ON user_triggers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Lessons policies (public read for anon + authenticated)
DROP POLICY IF EXISTS "Anyone can read lessons" ON lessons;
CREATE POLICY "Anyone can read lessons"
  ON lessons FOR SELECT
  TO anon, authenticated
  USING (true);

-- User Lesson Progress policies
DROP POLICY IF EXISTS "Users can view own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can view own lesson progress"
  ON user_lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can insert own lesson progress"
  ON user_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lesson progress" ON user_lesson_progress;
CREATE POLICY "Users can update own lesson progress"
  ON user_lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Daily Summaries policies
DROP POLICY IF EXISTS "Users can view own daily summaries" ON daily_summaries;
CREATE POLICY "Users can view own daily summaries"
  ON daily_summaries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own daily summaries" ON daily_summaries;
CREATE POLICY "Users can insert own daily summaries"
  ON daily_summaries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own daily summaries" ON daily_summaries;
CREATE POLICY "Users can update own daily summaries"
  ON daily_summaries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_foods_updated_at ON foods;
CREATE TRIGGER update_foods_updated_at BEFORE UPDATE ON foods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_triggers_updated_at ON user_triggers;
CREATE TRIGGER update_user_triggers_updated_at BEFORE UPDATE ON user_triggers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, join_date)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    TO_CHAR(NOW(), 'Mon YYYY')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-photos', 'meal-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own meal photos" ON storage.objects;
CREATE POLICY "Users can upload own meal photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'meal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can view own meal photos" ON storage.objects;
CREATE POLICY "Users can view own meal photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'meal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- =====================================================
-- SEED LESSON DATA
-- =====================================================
INSERT INTO lessons (module_number, lesson_number, title, content, estimated_read_time, key_takeaways) VALUES
(1, 1, 'Understanding Inflammation', 'Inflammation is your body''s natural response to cellular stress. When mitochondria can''t produce adequate ATP, your cells send distress signals that manifest as inflammation. This isn''t the enemy - it''s feedback. The Dowd Protocol addresses the ROOT CAUSE: mitochondrial dysfunction, not just the symptoms.', 5, ARRAY['Inflammation starts at cellular level', 'Mitochondria are key energy producers', 'Food directly affects ATP production', 'Synthetic additives damage mitochondria']),
(1, 2, 'The Gut-Brain-Mitochondria Axis', 'Your gut health directly impacts brain function and cellular energy production. 70% of your immune system lives in your gut. When gut lining is compromised (leaky gut), inflammatory particles enter bloodstream, triggering system-wide inflammation. This affects mitochondria everywhere - including your brain.', 7, ARRAY['70% of immune system in gut', 'Gut bacteria affect mood and cognition', 'Leaky gut = systemic inflammation', 'Healing gut heals mitochondria']),
(1, 3, 'Net Carbs vs Total Carbs', 'Fiber doesn''t spike insulin. Understanding net carbs (Total Carbs - Fiber) is critical for the protocol. Target: 15-20g net carbs per meal. Why? This keeps insulin low, allowing mitochondria to efficiently burn fat for fuel instead of constantly processing glucose.', 4, ARRAY['Net carbs = Total Carbs - Fiber', '15-20g per meal is target', 'Fiber is protective', 'Low insulin = efficient fat burning']),
(2, 1, 'Seed Oils: The Hidden Enemy', 'Industrially processed seed oils (soybean, canola, sunflower) are extracted using hexane (petroleum solvent), then heated to 450°F+ during deodorization. This creates oxidized omega-6 fats that damage mitochondrial membranes. Found in 90% of processed foods. Inflammation score: -10 to -12.', 8, ARRAY['Oxidized omega-6 fats damage mitochondria', 'Processed with hexane and extreme heat', 'Found in 90% of processed foods', 'Always check ingredient labels']),
(2, 2, 'Synthetic Preservatives', 'Calcium propionate, TBHQ, BHA/BHT - your body recognizes these as foreign invaders. They trigger immune response, disrupt gut bacteria, and directly damage mitochondrial DNA. Common in bread, cereals, processed meats. Even small amounts can trigger severe reactions in sensitive individuals.', 6, ARRAY['Trigger immune response', 'Disrupt beneficial gut bacteria', 'Damage mitochondrial DNA', 'Avoid at all costs - check every label']),
(3, 1, 'Food Synergies', 'Certain food combinations amplify anti-inflammatory effects beyond individual benefits. Turmeric + black pepper: piperine increases curcumin absorption 2000%. Omega-3 fish + cruciferous vegetables: DIM enhances anti-inflammatory pathways. Grass-fed meat + vegetables: nutrients work synergistically.', 5, ARRAY['Turmeric + black pepper = 2000% better absorption', 'Omega-3 + cruciferous = enhanced pathways', 'Whole foods contain natural synergies', 'Combinations > individual foods'])
ON CONFLICT (module_number, lesson_number) DO NOTHING;

SELECT 'CBI Database schema created successfully!' AS status;
