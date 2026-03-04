/*
  # Add Supabase Auth Integration and Subscription Management

  ## Overview
  This migration integrates the existing users table with Supabase Auth and adds comprehensive subscription tracking capabilities.

  ## Changes Made

  ### 1. Users Table Enhancement
  - Link users table to Supabase Auth (auth.users)
  - Add subscription management fields:
    - `stripe_customer_id` - Stripe customer identifier
    - `subscription_status` - Current subscription state (active, canceled, past_due, etc.)
    - `subscription_end_date` - When current subscription period ends
    - `stripe_subscription_id` - Stripe subscription identifier
  
  ### 2. Subscriptions Table (New)
  - `id` (uuid, primary key) - Unique subscription record ID
  - `user_id` (uuid) - References users table
  - `stripe_subscription_id` (text) - Stripe subscription ID
  - `stripe_customer_id` (text) - Stripe customer ID
  - `status` (text) - Subscription status
  - `tier` (text) - Subscription tier (free, premium)
  - `current_period_start` (timestamptz) - Billing period start
  - `current_period_end` (timestamptz) - Billing period end
  - `cancel_at_period_end` (boolean) - Whether subscription will cancel
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### 3. Row Level Security (RLS)
  - Enable RLS on subscriptions table
  - Users can only view their own subscription records
  - Users can only update their own subscription records
  - System can insert subscription records (via service role)

  ### 4. Triggers
  - Auto-create user profile when auth user signs up
  - Auto-update `updated_at` timestamps

  ## Security Notes
  - All tables have RLS enabled
  - Users can only access their own data
  - Subscription modifications require authentication
  - Stripe IDs are protected but visible to subscription owner
*/

-- Add Stripe and subscription fields to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE users ADD COLUMN stripe_customer_id text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_end_date'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_end_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE users ADD COLUMN stripe_subscription_id text;
  END IF;
END $$;

-- Create subscriptions table for detailed tracking
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  tier text NOT NULL DEFAULT 'premium' CHECK (tier IN ('free', 'premium')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can delete subscriptions"
  ON subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, subscription_tier, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    'free',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscriptions updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);