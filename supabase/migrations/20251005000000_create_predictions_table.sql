-- Predictions table for storing exoplanet prediction history
-- This table stores predictions made by users using the ML models

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- User reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Planet information
  planet_name TEXT NOT NULL,
  notes TEXT,
  
  -- Model and prediction details
  model_used TEXT NOT NULL, -- 'model1', 'model2', 'model3'
  prediction_result TEXT NOT NULL, -- 'candidate', 'false_positive', 'confirmed', 'rejected'
  confidence_score FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  is_exoplanet BOOLEAN NOT NULL,
  
  -- Store all parameters as JSONB for flexibility
  parameters JSONB NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_model_used ON predictions(model_used);
CREATE INDEX IF NOT EXISTS idx_predictions_is_exoplanet ON predictions(is_exoplanet);

-- Enable Row Level Security
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own predictions
CREATE POLICY "Users can view their own predictions"
  ON predictions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own predictions
CREATE POLICY "Users can insert their own predictions"
  ON predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own predictions
CREATE POLICY "Users can update their own predictions"
  ON predictions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own predictions
CREATE POLICY "Users can delete their own predictions"
  ON predictions FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_predictions_updated_at
  BEFORE UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE predictions IS 'Stores exoplanet predictions made by users using ML models';
COMMENT ON COLUMN predictions.user_id IS 'Reference to the user who made the prediction';
COMMENT ON COLUMN predictions.planet_name IS 'Name of the planetary candidate';
COMMENT ON COLUMN predictions.model_used IS 'Which ML model was used (model1, model2, model3)';
COMMENT ON COLUMN predictions.prediction_result IS 'Result from the ML model (candidate, false_positive, etc)';
COMMENT ON COLUMN predictions.confidence_score IS 'Confidence score from 0.0 to 1.0';
COMMENT ON COLUMN predictions.is_exoplanet IS 'Boolean flag indicating if predicted as exoplanet';
COMMENT ON COLUMN predictions.parameters IS 'All input parameters stored as JSON';
COMMENT ON COLUMN predictions.notes IS 'Optional user notes about the prediction';
