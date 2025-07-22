// Module 1 Workbook Types

export interface BusinessFilter {
  problem?: boolean | null;
  person?: boolean | null; 
  profit?: boolean | null;
  pull?: boolean | null;
  customPrompt?: string;
  aiResponse?: string;
}

export interface EdnaReflection {
  architectReflection1?: string;
  architectReflection2?: string;
  alchemistReflection1?: string;
  alchemistReflection2?: string;
}

export interface ClarityPrompts {
  businessIdea?: string;
  audience?: string;
  problem?: string;
  transformation?: string;
  vehicle?: string;
  emotion?: string;
  blocker?: string;
}

export interface OfferBuilder {
  transformation?: string;
  vehicle?: string;
  price?: string;
  timeline?: string;
  delivery?: string;
}

export interface ViabilityScores {
  clarity: number;
  demand: number;
  differentiation: number;
  delivery: number;
  scalability: number;
  profitability: number;
  competition: number;
  energy: number;
}

export interface NameLogoBuilder {
  finalDecisions?: {
    chosenBusinessName?: string;
    chosenTagline?: string;
    chosenColors?: string[];
  };
  nameRatings?: Record<string, number>;
}

// AI Response types
export interface AIPromptRequest {
  section: string;
  prompt: string;
  context?: any;
  dnaMode?: 'architect' | 'alchemist';
}

export interface AIPromptResponse {
  response: string;
  suggestions?: string[];
  nextSteps?: string[];
}