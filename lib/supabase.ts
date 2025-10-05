import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User profile information
export interface Profile {
  id: string;
  full_name: string;
  institution: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

// Prediction history from ML models
export interface Prediction {
  id: string;
  user_id: string;
  planet_name: string;
  model_used: 'model1' | 'model2' | 'model3'; // ML model identifier
  prediction_result: string; // Result from backend (e.g., "Candidate", "False Positive", "Confirmed")
  confidence_score: number | null; // 0-1 confidence score
  is_exoplanet: boolean; // Whether predicted as exoplanet
  parameters: Record<string, any>; // JSONB - all model parameters used
  notes: string;
  created_at: string;
  updated_at: string;
}

// Helper type for creating new predictions
export interface CreatePrediction {
  user_id: string;
  planet_name: string;
  model_used: 'model1' | 'model2' | 'model3';
  prediction_result: string;
  confidence_score: number | null;
  is_exoplanet: boolean;
  parameters: Record<string, any>;
  notes?: string;
}

