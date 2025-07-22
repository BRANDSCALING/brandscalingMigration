// Module 1: Build the Foundation - Type Definitions

export type DNAMode = "architect" | "alchemist";

// Section 1.1: Business Filter
export interface BusinessFilter {
  problem: boolean | null;
  person: boolean | null;
  profit: boolean | null;
  pull: boolean | null;
  customPrompt?: string;
  aiResponse?: string;
}

// Section 1.2: E-DNA Reflection
export interface EdnaReflection {
  architectReflection1: string;
  architectReflection2: string;
  alchemistReflection1: string;
  alchemistReflection2: string;
}

// Section 1.3: Clarity Prompts
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

// Section 1.4: Offer Builder
export interface OfferBuilder {
  transformation: string;
  vehicle: string;
  price: string;
  timeline: string;
  promise: string;
  aiResponseSpace: string;
  customPrompt: string;
  aiResponse: string;
  offerChecklist: {
    transformationClear: boolean;
    vehicleValuable: boolean;
    priceProfitable: boolean;
    urgencyReason: boolean;
    repeatableProfitable: boolean;
  };
}

// Section 1.5: Viability Scores
export interface ViabilityScores {
  clarity: number;
  demand: number;
  differentiation: number;
  deliveryFeasibility: number;
  emotionalPull: number;
  buyerUrgency: number;
  profitPotential: number;
  founderFit: number;
  totalScore: number;
  aiResponseSpace?: string;
  customPrompt?: string;
}

// Section 1.6: Name & Logo Builder
export interface NameLogoBuilder {
  businessNameOptions: string[];
  logoConceptDirections: string[];
  taglineOptions: string[];
  colorPalette: string;
  nameRatings: {
    name1EasyToSay: number;
    name1Memorable: number;
    name1Professional: number;
    name1DomainAvailable: number;
    name1FeelsRight: number;
    name1Total: number;
    name2EasyToSay: number;
    name2Memorable: number;
    name2Professional: number;
    name2DomainAvailable: number;
    name2FeelsRight: number;
    name2Total: number;
    name3EasyToSay: number;
    name3Memorable: number;
    name3Professional: number;
    name3DomainAvailable: number;
    name3FeelsRight: number;
    name3Total: number;
    name4EasyToSay: number;
    name4Memorable: number;
    name4Professional: number;
    name4DomainAvailable: number;
    name4FeelsRight: number;
    name4Total: number;
    name5EasyToSay: number;
    name5Memorable: number;
    name5Professional: number;
    name5DomainAvailable: number;
    name5FeelsRight: number;
    name5Total: number;
  };
  finalDecisions: {
    chosenBusinessName: string;
    chosenLogoDirection: string;
    chosenTagline: string;
    chosenColorPalette: string;
  };
  customPrompt: string;
  aiResponse: string;
}

// Workbook Session
export interface WorkbookSession {
  id: string;
  userId: string;
  dnaMode: DNAMode;
  businessFilter?: BusinessFilter;
  ednaReflection?: EdnaReflection;
  clarityPrompts?: ClarityPrompts;
  offerBuilder?: OfferBuilder;
  viabilityScores?: ViabilityScores;
  nameLogoBuilder?: NameLogoBuilder;
  completedSections: string[];
  currentSection: number;
  totalSections: number;
  createdAt: string;
  updatedAt: string;
}

// Component Props
export interface Section {
  id: string;
  title: string;
  component: string;
}

export interface BusinessFilterProps {
  session: WorkbookSession | undefined;
}

export interface EdnaReflectionProps {
  session: WorkbookSession | undefined;
}

export interface ClarityPromptsProps {
  session: WorkbookSession | undefined;
}

export interface OfferBuilderProps {
  session: WorkbookSession | undefined;
}

export interface ViabilityScoreCardProps {
  session: WorkbookSession | undefined;
}

export interface NameLogoBuilderProps {
  session: WorkbookSession | undefined;
}

export interface ProgressSidebarProps {
  sections: Section[];
  currentSectionIndex: number;
  completedSections: string[];
  onSectionClick: (index: number) => void;
}

export interface MobileProgressProps {
  sections: Section[];
  currentSectionIndex: number;
  completedSections: string[];
  onSectionClick: (index: number) => void;
}