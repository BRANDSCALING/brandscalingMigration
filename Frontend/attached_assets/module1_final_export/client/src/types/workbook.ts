export type DNAMode = "architect" | "alchemist";

export interface BusinessFilter {
  problem: boolean | null;
  person: boolean | null;
  profit: boolean | null;
  pull: boolean | null;
  customPrompt?: string;
  aiResponse?: string;
}

export interface ClarityPrompts {
  businessIdea: string;
  audience: string;
  problem: string;
  transformation: string;
  vehicle: string;
  emotion: string;
  blocker: string;
  aiResponse: string;
  clarityReflection: string;
  customPrompt: string;
}

export interface OfferBuilder {
  transformation: string;
  vehicle: string;
  price: string;
  timeline: string;
  promise: string;
}

export interface ViabilityScores {
  clarity: number;
  demand: number;
  audience: number;
  delivery: number;
  profit: number;
  differentiation: number;
  energy: number;
  scalability: number;
}

export interface BrandingData {
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keyBenefits: string;
  industry: string;
  selectedName: string | null;
}

export interface AIResponse {
  refinedConcept: string;
  monetizationModel: string;
  keyRisks: string[];
  launchIdeas: string[];
  summary: string[];
}

export interface BrandingSuggestions {
  businessNames: Array<{ name: string; rating: number }>;
  logoDirections: Array<{ type: string; description: string }>;
  taglines: string[];
  colorPalette: string[];
}

export interface WorkbookSection {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
