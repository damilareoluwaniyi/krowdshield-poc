/*
  # Initial Schema Setup for KrowdShield

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `username` (text)
      - `role` (text) - 'individual' or 'business'
      - `safety_score` (integer)
      - `created_at` (timestamp)
    
    - `locations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `safety_score` (integer)
      - `business_id` (uuid) - references users.id
      - `created_at` (timestamp)
    
    - `incidents`
      - `id` (uuid, primary key)
      - `type` (text)
      - `description` (text)
      - `location_id` (uuid) - references locations.id
      - `severity` (text)
      - `reported_by` (uuid) - references users.id
      - `coordinates` (point)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text NOT NULL,
  role text NOT NULL CHECK (role IN ('individual', 'business')),
  safety_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  safety_score integer DEFAULT 100,
  business_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  description text NOT NULL,
  location_id uuid REFERENCES locations(id),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  reported_by uuid REFERENCES users(id),
  coordinates point,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Locations policies
CREATE POLICY "Anyone can read locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business users can create locations"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'business'
    )
  );

CREATE POLICY "Business users can update their locations"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (business_id = auth.uid());

-- Incidents policies
CREATE POLICY "Anyone can read incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create incidents"
  ON incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own incidents"
  ON incidents
  FOR UPDATE
  TO authenticated
  USING (reported_by = auth.uid());