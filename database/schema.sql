-- FitFindr Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Analysis Results Table
-- Stores size analysis results for users
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  recommended_size TEXT NOT NULL,
  confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  category TEXT NOT NULL,
  brand TEXT,
  result_image TEXT,
  original_image TEXT,
  analysis_data JSONB, -- Store additional analysis data (AI model outputs, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_results_category ON analysis_results(category);

-- Brand Sizing Charts Table
-- Stores brand-specific sizing information
CREATE TABLE IF NOT EXISTS brand_sizing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL,
  category TEXT NOT NULL,
  size_chart JSONB NOT NULL, -- Store size chart data as JSON
  region TEXT DEFAULT 'US', -- US, EU, UK, etc.
  gender TEXT, -- male, female, unisex
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_name, category, region, gender)
);

-- Products Catalog Table
-- Stores product information for size matching
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  image_url TEXT,
  product_url TEXT,
  sizing_info JSONB, -- Store sizing information
  price_range TEXT, -- $, $$, $$$, etc.
  region TEXT DEFAULT 'US',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Feedback Table
-- Stores user feedback on size recommendations
CREATE TABLE IF NOT EXISTS size_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
  actual_size TEXT,
  fit_rating INTEGER CHECK (fit_rating >= 1 AND fit_rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sharing Table
-- Stores shared size recommendations
CREATE TABLE IF NOT EXISTS shared_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
  share_code TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Analysis Results RLS
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analysis results" ON analysis_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis results" ON analysis_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analysis results" ON analysis_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analysis results" ON analysis_results
  FOR DELETE USING (auth.uid() = user_id);

-- Brand Sizing RLS (public read, admin write)
ALTER TABLE brand_sizing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brand sizing" ON brand_sizing
  FOR SELECT USING (true);

-- Products RLS (public read, admin write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Size Feedback RLS
ALTER TABLE size_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback" ON size_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" ON size_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shared Recommendations RLS
ALTER TABLE shared_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shared recommendations" ON shared_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shared recommendations" ON shared_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_analysis_results_updated_at 
  BEFORE UPDATE ON analysis_results 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_sizing_updated_at 
  BEFORE UPDATE ON brand_sizing 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
INSERT INTO brand_sizing (brand_name, category, size_chart, region, gender) VALUES
('Nike', 'shirts', '{"XS": {"chest": "32-34", "waist": "26-28"}, "S": {"chest": "34-36", "waist": "28-30"}, "M": {"chest": "36-38", "waist": "30-32"}, "L": {"chest": "38-40", "waist": "32-34"}, "XL": {"chest": "40-42", "waist": "34-36"}}', 'US', 'male'),
('Adidas', 'shirts', '{"XS": {"chest": "32-34", "waist": "26-28"}, "S": {"chest": "34-36", "waist": "28-30"}, "M": {"chest": "36-38", "waist": "30-32"}, "L": {"chest": "38-40", "waist": "32-34"}, "XL": {"chest": "40-42", "waist": "34-36"}}', 'US', 'male'),
('Levi''s', 'pants', '{"28": {"waist": "28", "inseam": "30"}, "30": {"waist": "30", "inseam": "30"}, "32": {"waist": "32", "inseam": "30"}, "34": {"waist": "34", "inseam": "30"}, "36": {"waist": "36", "inseam": "30"}}', 'US', 'male')
ON CONFLICT (brand_name, category, region, gender) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE analysis_results IS 'Stores size analysis results for users';
COMMENT ON TABLE brand_sizing IS 'Stores brand-specific sizing information';
COMMENT ON TABLE products IS 'Stores product information for size matching';
COMMENT ON TABLE size_feedback IS 'Stores user feedback on size recommendations';
COMMENT ON TABLE shared_recommendations IS 'Stores shared size recommendations'; 