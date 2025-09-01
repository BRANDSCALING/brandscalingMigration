import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const workbookSessions = pgTable("workbook_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  dnaMode: text("dna_mode").notNull().default("architect"), // 'architect' | 'alchemist'
  
  // Section 1.1: Business Filter
  businessFilter: json("business_filter").$type<{
    problem: boolean | null;
    person: boolean | null;
    profit: boolean | null;
    pull: boolean | null;
    customPrompt?: string;
    aiResponse?: string;
  }>(),
  
  // Section 1.2: E-DNA Reflection
  ednaReflection: json("edna_reflection").$type<{
    architectReflection1: string;
    architectReflection2: string;
    alchemistReflection1: string;
    alchemistReflection2: string;
  }>(),
  
  // Section 1.3: Clarity Prompts
  clarityPrompts: json("clarity_prompts").$type<{
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
  }>(),
  
  // Section 1.4: Offer Builder
  offerBuilder: json("offer_builder").$type<{
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
  }>(),
  
  // Section 1.5: Viability Scorecard
  viabilityScores: json("viability_scores").$type<{
    clarity: number;
    demand: number;
    differentiation: number;
    deliveryFeasibility: number;
    emotionalPull: number;
    buyerUrgency: number;
    profitPotential: number;
    founderFit: number;
    totalScore: number;
    aiResponseSpace: string;
    customPrompt: string;
  }>(),

  // Section 1.6: Name & Logo Builder
  nameLogoBuilder: json("name_logo_builder").$type<{
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
  }>(),
  
  // Section 1.6: Name & Brand Builder
  brandingData: json("branding_data").$type<{
    businessSummary: string;
    targetAudience: string;
    productService: string;
    nameOptions: Array<{
      name: string;
      available: boolean;
      rating: number;
    }>;
    finalName: string;
    tagline: string;
    brandColors: string;
    logoConceptSelected: string;
    namingCriteria: {
      domainAvailable: boolean;
      shortLength: boolean;
      memorable: boolean;
      noSpellingConfusion: boolean;
      alignedWithOffer: boolean;
      visualPotential: boolean;
      socialHandlesAvailable: boolean;
      noTrademarkConflicts: boolean;
    };
  }>(),
  
  // Module 2: Brand Builder
  module2: json("module2").$type<{
    brandFoundation?: {
      isCompleted: boolean;
    };
    brandDefinition?: {
      emotionalResponse: string;
      strategicPosition: string;
      brandPromise: string;
      differentiation: string;
      customPrompt?: string;
    };
    brandIdentity?: {
      businessIdea: string;
      audience: string;
      transformation: string;
      desiredFeeling: string;
      aiResponse: string;
      originSpark: string;
      frustrationMoment: string;
      turningPoint: string;
      bigWhy: string;
      personalAdvantage: string;
      visionAhead: string;
      closingLine: string;
      toneAnchor1: string;
      toneAnchor2: string;
      toneAnchor3: string;
      personaSnapshot: string;
      voiceToneResponse: string;
      visualIdentityResponse: string;
      businessName: string;
      tagline: string;
      logoColorPalette: string;
      audienceDefinition: string;
      brandStoryShortened: string;
      brandToneVoice: string;
      websiteCopyStart: string;
    };
  }>(),
  
  // Module 2 Section Data (2.3-2.8)
  logoVisualIdentity: json("logo_visual_identity").$type<{
    businessName?: string;
    industry?: string;
    brandFeel?: string;
    keywords?: string;
    logoIdeas?: string;
    colorPalette?: string;
    fontPairing?: string;
    moodboard?: string;
    checklist?: {
      aiPrompt?: boolean;
      visualStyles?: boolean;
      visualClarity?: boolean;
      logoReadability?: boolean;
      logoFile?: boolean;
      colorPalette?: boolean;
      fontPairing?: boolean;
      brandAssets?: boolean;
    };
  }>(),
  
  brandStoryGuideline: json("brand_story_guideline").$type<{
    businessName?: string;
    industry?: string;
    brandFeel?: string;
    targetPeople?: string;
    favoriteWords?: string;
    brandStory?: string;
    brandPurpose?: string;
    brandMission?: string;
    brandValue1?: string;
    brandValue2?: string;
    brandValue3?: string;
    toneOfVoice?: string;
    audienceOverview?: string;
    visualKeyword1?: string;
    visualKeyword2?: string;
    visualKeyword3?: string;
    ctaSentence?: string;
  }>(),
  
  socialProfileSetup: json("social_profile_setup").$type<{
    businessName?: string;
    businessOffer?: string;
    audience?: string;
    businessType?: "Digital" | "Physical" | "Hybrid" | "";
    toneOfVoice?: string;
    websiteLink?: string;
    instagramBio?: string;
    linkedinHeadline?: string;
    linkedinSummary?: string;
    tagline?: string;
    callToAction?: string;
    contentIdeas?: string;
    brandEnergy?: string;
    googleBusinessSetup?: {
      listing?: boolean;
      address?: boolean;
      photos?: boolean;
      reviews?: boolean;
    };
  }>(),
  
  linkInfrastructure: json("link_infrastructure").$type<{
    businessType?: "Digital" | "Physical" | "Hybrid" | "";
    offer?: string;
    goal?: string;
    currentLinks?: string;
    brandTone?: string;
    bestLinkSystem?: string;
    topCallToActions?: string;
    topCallToAction1?: string;
    topCallToAction2?: string;
    topCallToAction3?: string;
    visualStructure?: string;
    brandLanguage?: string;
    checklist?: {
      choosePlatform?: boolean;
      setupHub?: boolean;
      addCallToActions?: boolean;
      testLinks?: boolean;
      addToSocial?: boolean;
      updateMaterials?: boolean;
    };
  }>(),
  
  brandBioProfile: json("brand_bio_profile").$type<{
    platform?: string;
    targetAudience?: string;
    coreResult?: string;
    method?: string;
    mission?: string;
    draftBio1?: string;
    draftBio2?: string;
    finalBio?: string;
    callToAction?: string;
  }>(),
  
  contentLaunchChecklist: json("content_launch_checklist").$type<{
    businessIdea?: string;
    audience?: string;
    personalStory?: string;
    coreOffer?: string;
    brandTone?: string;
    platforms?: string;
    post1?: string;
    post2?: string;
    post3?: string;
    post4?: string;
    post5?: string;
    post6?: string;
    post7?: string;
    post8?: string;
    post9?: string;
    post10?: string;
    contentThemes?: string;
    postingSchedule?: string;
  }>(),
  
  completedSections: json("completed_sections").$type<string[]>(),
  energyLevel: integer("energy_level").notNull().default(7),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWorkbookSessionSchema = createInsertSchema(workbookSessions).omit({
  id: true,
});

export const updateWorkbookSessionSchema = insertWorkbookSessionSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WorkbookSession = typeof workbookSessions.$inferSelect;
export type InsertWorkbookSession = z.infer<typeof insertWorkbookSessionSchema>;
export type UpdateWorkbookSession = z.infer<typeof updateWorkbookSessionSchema>;
