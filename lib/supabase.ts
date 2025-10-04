import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  institution: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface Exoplanet {
  id: string;
  name: string;
  host_star: string;
  discovery_method: string;
  discovery_year: number;
  orbital_period: number;
  planet_radius: number;
  planet_mass: number;
  semi_major_axis: number;
  eccentricity: number;
  equilibrium_temperature: number;
  stellar_magnitude: number;
  distance_from_earth: number;
  habitable_zone: boolean;
  description: string;
  created_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  planet_name: string;
  orbital_period: number;
  planet_radius: number;
  planet_mass: number;
  semi_major_axis: number;
  eccentricity: number;
  stellar_magnitude: number;
  transit_depth: number;
  transit_duration: number;
  stellar_temperature: number;
  prediction_result: string;
  confidence_score: number;
  is_exoplanet: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}
