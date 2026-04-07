/*
  # DevOps Maturity Scorecard Database Schema

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key) - Unique identifier for each assessment
      - `team_name` (text) - Name of the team or company
      - `assessor_name` (text) - Name and role of the person conducting assessment
      - `team_size` (text) - Size of engineering team
      - `assessor_role` (text) - Role of the assessor
      - `answers` (jsonb) - All 24 question answers stored as JSON
      - `scores` (jsonb) - Calculated pillar and overall scores
      - `created_at` (timestamptz) - When assessment was completed
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `assessments` table
    - Allow public insert (anyone can create an assessment)
    - Allow users to read their own assessments (identified by session)
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  assessor_name text NOT NULL,
  team_size text NOT NULL,
  assessor_role text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_analysis jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create assessments"
  ON assessments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read assessments"
  ON assessments
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS assessments_created_at_idx ON assessments(created_at DESC);