/*
  # Pet Health Document and History System

  ## Overview
  This migration creates a comprehensive system for managing pet documents, veterinary history, 
  and AI-powered recommendations for pet owners.

  ## New Tables

  ### 1. `users`
  Stores user account information and subscription status
  - `id` (uuid, primary key) - User identifier
  - `email` (text, unique) - User email address
  - `subscription_tier` (text) - User's subscription level (free/premium)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `pets`
  Stores information about pets owned by users
  - `id` (uuid, primary key) - Pet identifier
  - `user_id` (uuid, foreign key) - Owner reference
  - `name` (text) - Pet's name
  - `species` (text) - Type of animal (dog, cat, etc.)
  - `breed` (text) - Pet's breed
  - `date_of_birth` (date) - Pet's birthday
  - `weight` (numeric) - Current weight
  - `medical_conditions` (text[]) - Array of known conditions
  - `allergies` (text[]) - Array of known allergies
  - `medications` (text[]) - Current medications
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `pet_documents`
  Stores uploaded documents related to pet health
  - `id` (uuid, primary key) - Document identifier
  - `pet_id` (uuid, foreign key) - Associated pet
  - `user_id` (uuid, foreign key) - Owner reference
  - `document_type` (text) - Type of document (medical_record, vaccination, lab_result, prescription, other)
  - `title` (text) - Document title
  - `file_url` (text) - URL to stored document file
  - `file_name` (text) - Original filename
  - `file_size` (integer) - File size in bytes
  - `upload_date` (timestamptz) - When document was uploaded
  - `notes` (text) - Additional notes about document
  - `extracted_data` (jsonb) - AI-extracted structured data
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `vet_history`
  Stores veterinary visit history and health events
  - `id` (uuid, primary key) - History entry identifier
  - `pet_id` (uuid, foreign key) - Associated pet
  - `user_id` (uuid, foreign key) - Owner reference
  - `visit_date` (date) - Date of vet visit or health event
  - `visit_type` (text) - Type of visit (checkup, vaccination, emergency, surgery, other)
  - `vet_name` (text) - Veterinarian or clinic name
  - `reason` (text) - Reason for visit
  - `diagnosis` (text) - Diagnosis or findings
  - `treatment` (text) - Treatment provided
  - `medications_prescribed` (text[]) - Medications prescribed
  - `follow_up_needed` (boolean) - Whether follow-up is required
  - `follow_up_date` (date) - Date for follow-up visit
  - `cost` (numeric) - Visit cost
  - `notes` (text) - Additional notes
  - `document_id` (uuid, foreign key, nullable) - Associated document if applicable
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. `health_recommendations`
  Stores AI-generated health recommendations for pets
  - `id` (uuid, primary key) - Recommendation identifier
  - `pet_id` (uuid, foreign key) - Associated pet
  - `user_id` (uuid, foreign key) - Owner reference
  - `recommendation_type` (text) - Type (vaccination_due, checkup_reminder, medication_refill, health_tip, dietary_advice)
  - `title` (text) - Recommendation title
  - `description` (text) - Detailed recommendation
  - `priority` (text) - Priority level (high, medium, low)
  - `due_date` (date, nullable) - When action is due
  - `status` (text) - Status (active, completed, dismissed)
  - `generated_at` (timestamptz) - When recommendation was generated
  - `completed_at` (timestamptz, nullable) - When marked complete
  - `source_data` (jsonb) - Data used to generate recommendation
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Policies enforce user ownership through user_id checks
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  date_of_birth date,
  weight numeric,
  medical_conditions text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  medications text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets"
  ON pets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
  ON pets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
  ON pets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create pet_documents table
CREATE TABLE IF NOT EXISTS pet_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('medical_record', 'vaccination', 'lab_result', 'prescription', 'other')),
  title text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  upload_date timestamptz DEFAULT now(),
  notes text,
  extracted_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pet_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pet documents"
  ON pet_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pet documents"
  ON pet_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pet documents"
  ON pet_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pet documents"
  ON pet_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create vet_history table
CREATE TABLE IF NOT EXISTS vet_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  visit_type text NOT NULL CHECK (visit_type IN ('checkup', 'vaccination', 'emergency', 'surgery', 'dental', 'grooming', 'other')),
  vet_name text,
  reason text,
  diagnosis text,
  treatment text,
  medications_prescribed text[] DEFAULT '{}',
  follow_up_needed boolean DEFAULT false,
  follow_up_date date,
  cost numeric,
  notes text,
  document_id uuid REFERENCES pet_documents(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vet_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vet history"
  ON vet_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vet history"
  ON vet_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vet history"
  ON vet_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vet history"
  ON vet_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create health_recommendations table
CREATE TABLE IF NOT EXISTS health_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL CHECK (recommendation_type IN ('vaccination_due', 'checkup_reminder', 'medication_refill', 'health_tip', 'dietary_advice', 'exercise_suggestion', 'preventive_care')),
  title text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  due_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dismissed')),
  generated_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  source_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON health_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON health_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON health_recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON health_recommendations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_documents_pet_id ON pet_documents(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_documents_user_id ON pet_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_vet_history_pet_id ON vet_history(pet_id);
CREATE INDEX IF NOT EXISTS idx_vet_history_user_id ON vet_history(user_id);
CREATE INDEX IF NOT EXISTS idx_vet_history_visit_date ON vet_history(visit_date);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_pet_id ON health_recommendations(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_user_id ON health_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_status ON health_recommendations(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vet_history_updated_at BEFORE UPDATE ON vet_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
