/*
  # Exoplanet Discovery Platform Schema

  ## Overview
  This migration creates the complete database schema for a NASA Space Apps Challenge exoplanet identification platform.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `institution` (text) - Research institution or organization
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `exoplanets`
  Known exoplanet catalog data
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Exoplanet name
  - `host_star` (text) - Host star name
  - `discovery_method` (text) - Method used to discover the planet
  - `discovery_year` (integer) - Year of discovery
  - `orbital_period` (numeric) - Orbital period in days
  - `planet_radius` (numeric) - Planet radius in Earth radii
  - `planet_mass` (numeric) - Planet mass in Earth masses
  - `semi_major_axis` (numeric) - Semi-major axis in AU
  - `eccentricity` (numeric) - Orbital eccentricity
  - `equilibrium_temperature` (numeric) - Temperature in Kelvin
  - `stellar_magnitude` (numeric) - Host star magnitude
  - `distance_from_earth` (numeric) - Distance in light years
  - `habitable_zone` (boolean) - Whether in habitable zone
  - `description` (text) - Additional description
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `predictions`
  User-submitted planet predictions and ML results
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References profiles(id)
  - `planet_name` (text) - User-provided name
  - `orbital_period` (numeric) - Orbital period in days
  - `planet_radius` (numeric) - Planet radius in Earth radii
  - `planet_mass` (numeric) - Planet mass in Earth masses
  - `semi_major_axis` (numeric) - Semi-major axis in AU
  - `eccentricity` (numeric) - Orbital eccentricity
  - `stellar_magnitude` (numeric) - Host star magnitude
  - `transit_depth` (numeric) - Transit depth percentage
  - `transit_duration` (numeric) - Transit duration in hours
  - `stellar_temperature` (numeric) - Star temperature in Kelvin
  - `prediction_result` (text) - ML model prediction result
  - `confidence_score` (numeric) - Prediction confidence (0-1)
  - `is_exoplanet` (boolean) - Predicted as exoplanet
  - `notes` (text) - User notes
  - `created_at` (timestamptz) - Prediction timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can view all profiles, but only update their own
  - Exoplanets: Public read access, admin write only
  - Predictions: Users can only view and manage their own predictions

  ## Important Notes
  1. All tables use UUID for primary keys
  2. Timestamps use timestamptz for timezone awareness
  3. Row Level Security is enabled for data protection
  4. Default values ensure data consistency
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  institution text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create exoplanets catalog table
CREATE TABLE IF NOT EXISTS exoplanets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  host_star text NOT NULL DEFAULT '',
  discovery_method text NOT NULL DEFAULT '',
  discovery_year integer,
  orbital_period numeric,
  planet_radius numeric,
  planet_mass numeric,
  semi_major_axis numeric,
  eccentricity numeric,
  equilibrium_temperature numeric,
  stellar_magnitude numeric,
  distance_from_earth numeric,
  habitable_zone boolean DEFAULT false,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  planet_name text NOT NULL DEFAULT '',
  orbital_period numeric,
  planet_radius numeric,
  planet_mass numeric,
  semi_major_axis numeric,
  eccentricity numeric,
  stellar_magnitude numeric,
  transit_depth numeric,
  transit_duration numeric,
  stellar_temperature numeric,
  prediction_result text DEFAULT 'pending',
  confidence_score numeric,
  is_exoplanet boolean,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exoplanets ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Exoplanets policies (public read access)
CREATE POLICY "Exoplanets are viewable by everyone"
  ON exoplanets FOR SELECT
  TO authenticated
  USING (true);

-- Predictions policies
CREATE POLICY "Users can view their own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictions"
  ON predictions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions"
  ON predictions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exoplanets_name ON exoplanets(name);
CREATE INDEX IF NOT EXISTS idx_exoplanets_discovery_year ON exoplanets(discovery_year);

-- Insert sample exoplanet data
INSERT INTO exoplanets (name, host_star, discovery_method, discovery_year, orbital_period, planet_radius, planet_mass, semi_major_axis, eccentricity, equilibrium_temperature, stellar_magnitude, distance_from_earth, habitable_zone, description) VALUES
  ('Kepler-452b', 'Kepler-452', 'Transit', 2015, 384.8, 1.6, 5.0, 1.05, 0.0, 265, 13.4, 1400, true, 'Often called Earth''s cousin, this exoplanet orbits in the habitable zone of a Sun-like star.'),
  ('TRAPPIST-1e', 'TRAPPIST-1', 'Transit', 2017, 6.1, 0.92, 0.62, 0.029, 0.0, 251, 18.8, 40, true, 'One of seven Earth-sized planets orbiting an ultra-cool dwarf star, potentially habitable.'),
  ('Proxima Centauri b', 'Proxima Centauri', 'Radial Velocity', 2016, 11.2, 1.3, 1.27, 0.049, 0.11, 234, 11.1, 4.2, true, 'The closest known exoplanet to Earth, orbiting our nearest stellar neighbor.'),
  ('51 Pegasi b', '51 Pegasi', 'Radial Velocity', 1995, 4.2, 1.9, 150, 0.052, 0.01, 1200, 5.5, 50, false, 'The first exoplanet discovered around a Sun-like star, a hot Jupiter.'),
  ('HD 209458 b', 'HD 209458', 'Transit', 1999, 3.5, 1.4, 220, 0.047, 0.0, 1449, 7.6, 159, false, 'First exoplanet observed transiting its star, nicknamed Osiris.'),
  ('Kepler-22b', 'Kepler-22', 'Transit', 2011, 289.9, 2.4, 9.1, 0.85, 0.0, 262, 11.7, 620, true, 'The first confirmed planet found in the habitable zone by Kepler mission.'),
  ('GJ 1214 b', 'GJ 1214', 'Transit', 2009, 1.6, 2.7, 6.5, 0.014, 0.0, 555, 14.7, 48, false, 'A super-Earth with a thick atmosphere, possibly a water world.'),
  ('WASP-121b', 'WASP-121', 'Transit', 2015, 1.3, 1.9, 370, 0.025, 0.0, 2500, 10.4, 850, false, 'An ultra-hot Jupiter with temperatures hot enough to vaporize iron.'),
  ('LHS 1140 b', 'LHS 1140', 'Transit', 2017, 24.7, 1.7, 6.6, 0.09, 0.0, 230, 14.2, 40, true, 'A rocky super-Earth in the habitable zone with potential for water.'),
  ('K2-18b', 'K2-18', 'Transit', 2015, 33.0, 2.6, 8.6, 0.14, 0.0, 273, 13.5, 124, true, 'Water vapor detected in atmosphere, potential for life-supporting conditions.')
ON CONFLICT (name) DO NOTHING;