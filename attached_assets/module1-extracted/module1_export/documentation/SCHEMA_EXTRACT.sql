-- THE IDEA-TO-LAUNCH KIT™ Module 1 Database Schema Extract
-- Add these fields to your existing workbook_sessions table

-- If creating a new table:
CREATE TABLE workbook_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  dna_mode TEXT NOT NULL DEFAULT 'architect', -- 'architect' | 'alchemist'
  
  -- Module 1 Fields
  business_filter JSONB,
  edna_reflection JSONB,
  clarity_prompts JSONB,
  offer_builder JSONB,
  viability_scores JSONB,
  branding_results JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- If adding to existing table:
ALTER TABLE workbook_sessions 
ADD COLUMN IF NOT EXISTS business_filter JSONB,
ADD COLUMN IF NOT EXISTS edna_reflection JSONB,
ADD COLUMN IF NOT EXISTS clarity_prompts JSONB,
ADD COLUMN IF NOT EXISTS offer_builder JSONB,
ADD COLUMN IF NOT EXISTS viability_scores JSONB,
ADD COLUMN IF NOT EXISTS branding_results JSONB,
ADD COLUMN IF NOT EXISTS dna_mode TEXT DEFAULT 'architect';

-- Sample data structure for each JSON field:

-- business_filter example:
{
  "problem": true,
  "person": false,
  "profit": null,
  "pull": true,
  "customPrompt": "Custom AI prompt text...",
  "aiResponse": "AI generated response..."
}

-- edna_reflection example:
{
  "architectReflection1": "Reflection text...",
  "architectReflection2": "Reflection text...",
  "alchemistReflection1": "Reflection text...",
  "alchemistReflection2": "Reflection text..."
}

-- clarity_prompts example:
{
  "businessIdea": "My business idea...",
  "audience": "Target audience...",
  "problem": "Problem description...",
  "transformation": "Transformation...",
  "vehicle": "Delivery vehicle...",
  "emotion": "Emotional aspect...",
  "blocker": "Current blocker...",
  "aiResponse": "AI response...",
  "clarityReflection": "Personal reflection...",
  "customPrompt": "Custom prompt..."
}

-- offer_builder example:
{
  "transformation": "Transformation offered...",
  "vehicle": "Delivery method...",
  "price": "Pricing strategy...",
  "timeline": "Timeline...",
  "promise": "Promise made...",
  "aiResponseSpace": "AI insights...",
  "customPrompt": "Custom prompt...",
  "aiResponse": "AI response...",
  "offerChecklist": {
    "transformationClear": true,
    "vehicleValuable": false,
    "priceProfitable": true,
    "urgencyReason": false,
    "repeatableProfitable": true
  }
}

-- viability_scores example:
{
  "clarity": 8,
  "demand": 7,
  "differentiation": 6,
  "deliveryFeasibility": 9,
  "emotionalPull": 7,
  "buyerUrgency": 5,
  "profitPotential": 8,
  "founderFit": 9,
  "totalScore": 59
}

-- branding_results example:
{
  "businessDescription": "Business description...",
  "targetAudience": "Target audience...",
  "brandTone": "Professional and friendly",
  "keyBenefits": "Key benefits...",
  "industry": "Technology",
  "selectedBusinessName": "Chosen Business Name",
  "selectedTagline": "Chosen Tagline",
  "selectedColors": ["#6B46C1", "#EA580C"],
  "aiResponse": "AI branding response...",
  "customPrompt": "Custom branding prompt..."
}