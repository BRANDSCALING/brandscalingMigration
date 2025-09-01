import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema, insertBusinessModelSchema, insertBusinessClaritySchema, insertProductDesignSchema, insertLaunchPlanSchema, insertFeedbackLoopSchema, insertProgressTrackerSchema } from "@shared/schema";
import { z } from "zod";
import wizardRouter from "./wizard.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mount wizard routes
  app.use("/api/wizard", wizardRouter);

  // Intro status endpoint
  app.get("/api/intro-status", async (req, res) => {
    try {
      const module = await storage.getModule("1A");
      if (!module) {
        return res.status(404).json({ 
          status: "Module not found",
          error: "Module 1A not initialized"
        });
      }

      res.json({
        status: "Smart Business Builder Module 1A active",
        module: {
          id: module.moduleId,
          title: module.title,
          status: module.status
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "Error retrieving module status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all modules
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json({ modules });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to retrieve modules"
      });
    }
  });

  // Get user progress for a module
  app.get("/api/progress/:userId/:moduleId", async (req, res) => {
    try {
      const { userId, moduleId } = req.params;
      const userIdNum = parseInt(userId);
      
      if (isNaN(userIdNum)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const progress = await storage.getUserProgress(userIdNum, moduleId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      res.json({ progress });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to retrieve progress"
      });
    }
  });

  // Update user progress
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      
      // Check if progress already exists
      const existingProgress = await storage.getUserProgress(
        progressData.userId!, 
        progressData.moduleId
      );

      let result;
      if (existingProgress) {
        result = await storage.updateUserProgress(
          progressData.userId!,
          progressData.moduleId,
          progressData
        );
      } else {
        result = await storage.createUserProgress(progressData);
      }

      res.json({ progress: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid progress data",
          details: error.errors
        });
      }
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to update progress"
      });
    }
  });

  // Generate business model using GPT
  app.post("/api/generate-model", async (req, res) => {
    try {
      const { userId, dnaType, answers } = req.body;
      
      if (!userId || !dnaType || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: "Missing required fields: userId, dnaType, answers" });
      }

      if (answers.length !== 10) {
        return res.status(400).json({ error: "Expected exactly 10 answers from wizard steps" });
      }

      // Construct GPT prompt based on DNA type and answers
      const dnaContext = dnaType === "Architect" 
        ? "logical, systematic, data-driven, and structured approach focused on scalable systems and efficiency"
        : "intuitive, creative, people-centered, and holistic approach focused on transformation and authentic connection";

      const prompt = `You are a business consultant helping an entrepreneur with ${dnaType} DNA (${dnaContext}). 

Based on their 10-step wizard responses, create a comprehensive business model. Use a tone and recommendations that align with their ${dnaType} personality.

Their responses:
1. Business Idea: ${answers[0]}
2. Problem Definition: ${answers[1]}
3. Target Audience: ${answers[2]}
4. Timing Analysis: ${answers[3]}
5. Offer Definition: ${answers[4]}
6. Revenue Model: ${answers[5]}
7. Cost Analysis: ${answers[6]}
8. Unique Value Proposition: ${answers[7]}
9. Potential Blockers: ${answers[8]}
10. Support Needs: ${answers[9]}

Provide a structured response with these sections:

**BUSINESS MODEL SUMMARY** (400-500 words):
Rewrite their business concept into a clear, viable business model including:
- Target Customer & Problem
- Solution & Unique Value
- Revenue Streams & Pricing
- Key Activities & Resources
- Distribution Channels
- Cost Structure
- Competitive Advantage

**FIXES & WARNINGS** (200-300 words):
Identify potential risks, gaps, or areas needing clarification. Be constructive and specific.

**NEXT STEP SUGGESTIONS** (200-300 words):
Provide 3-5 actionable next steps prioritized for launch readiness.

**CONFIDENCE ASSESSMENT**:
Rate confidence level 1-10 based on market viability, clarity of execution, and competitive positioning.

Keep the tone ${dnaType === "Architect" ? "professional, analytical, and process-focused" : "encouraging, intuitive, and relationship-focused"}.`;

      // Demo mode with sample business model generation
      console.log("Generating demo business model based on user inputs...");
      
      // Create a personalized demo response based on the user's inputs
      const businessIdea = answers[0];
      const problem = answers[1];
      const audience = answers[2];
      const offer = answers[4];
      const revenue = answers[5];
      
      const dnaStyle = dnaType === "Architect" ? "systematic and data-driven" : "intuitive and people-centered";
      
      const model = `**${dnaType} Business Model for ${businessIdea}**

TARGET CUSTOMER & PROBLEM:
Your target customers are ${audience.toLowerCase()} who face the challenge of ${problem.toLowerCase()}. This represents a significant market opportunity in today's business landscape.

SOLUTION & UNIQUE VALUE:
Your solution involves ${offer.toLowerCase()}, delivered with a ${dnaStyle} approach that sets you apart from competitors. This positions you as a specialized expert in your field.

REVENUE STREAMS & PRICING:
Based on your revenue model of ${revenue.toLowerCase()}, you have a clear path to monetization with scalable income potential.

KEY ACTIVITIES & RESOURCES:
- Client acquisition and relationship management
- Service delivery and quality assurance
- Continuous improvement and skill development
- Market research and competitive analysis

DISTRIBUTION CHANNELS:
- Direct sales and referral networks
- Digital marketing and content creation
- Strategic partnerships and collaborations
- Professional networking and industry events

COST STRUCTURE:
Your main costs will include time investment, tools and technology, marketing expenses, and potential team expansion as you scale.

COMPETITIVE ADVANTAGE:
Your ${dnaType.toLowerCase()} approach combined with specialized expertise creates a defensible market position that's difficult for competitors to replicate.`;

      const warnings = `**Key Areas for Attention:**

1. **Market Validation**: Ensure strong demand exists before significant investment
2. **Pricing Strategy**: Test different price points to optimize revenue
3. **Scalability**: Plan for growth without proportional cost increases
4. **Competition**: Monitor market changes and adapt accordingly
5. **Customer Retention**: Focus on delivering exceptional value to maintain recurring revenue`;

      const suggestions = `**Next Steps for Launch:**

1. **Customer Discovery**: Conduct 10-15 interviews with potential customers to validate assumptions
2. **MVP Development**: Create a minimum viable version of your service offering
3. **Pilot Program**: Launch with 2-3 beta customers to refine your approach
4. **Marketing Foundation**: Develop website, social media presence, and lead generation system
5. **Financial Planning**: Set up accounting systems and track key metrics from day one`;

      const confidence = dnaType === "Architect" ? 8 : 7; // Architects tend to have more structured approaches

      // Log the generation for tracking
      console.log(`[${new Date().toISOString()}] Generated demo business model for user ${userId} (${dnaType} DNA)`);

      res.json({
        model: model,
        warnings: warnings,
        suggestions: suggestions,
        confidence: confidence
      });

    } catch (error) {
      console.error("Error generating business model:", error);
      res.status(500).json({ error: "Internal server error while generating business model" });
    }
  });

  // Save business model to dashboard
  app.post("/api/save-model", async (req, res) => {
    try {
      const modelData = insertBusinessModelSchema.parse(req.body);
      
      // Log the save operation
      console.log(`[${new Date().toISOString()}] Saving business model for user ${modelData.userId}`);
      console.log("Model data:", {
        label: modelData.label,
        status: modelData.status,
        confidence: modelData.confidence,
        modelLength: modelData.model.length,
        warningsLength: modelData.warnings?.length || 0,
        suggestionsLength: modelData.suggestions?.length || 0
      });

      // Save to storage (currently in-memory, placeholder for PostgreSQL)
      const savedModel = await storage.createBusinessModel(modelData);
      
      // Placeholder for PostgreSQL implementation:
      // INSERT INTO business_models (user_id, label, status, model, warnings, suggestions, confidence, created_at) 
      // VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      
      res.json({ 
        message: "Model saved to your dashboard.",
        modelId: savedModel.id,
        savedAt: savedModel.createdAt
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid model data",
          details: error.errors
        });
      }
      console.error("Error saving business model:", error);
      res.status(500).json({ error: "Failed to save business model" });
    }
  });

  // Get saved business models for user
  app.get("/api/saved-models/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const models = await storage.getBusinessModelsByUser(userId);
      
      res.json({ models });
    } catch (error) {
      console.error("Error retrieving saved models:", error);
      res.status(500).json({ error: "Failed to retrieve saved models" });
    }
  });

  // Get saved business models (Dashboard Module 4)
  app.get("/api/models/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(`[${new Date().toISOString()}] Fetching models for user: ${userId}`);
      
      const models = await storage.getBusinessModelsByUser(userId);
      console.log(`[${new Date().toISOString()}] Found ${models.length} models for user ${userId}`);
      
      if (models.length > 0) {
        console.log("Sample model:", {
          id: models[0].id,
          userId: models[0].userId,
          label: models[0].label
        });
      }
      
      // Transform the models to include dnaType and proper structure for dashboard
      const dashboardModels = models.map(model => ({
        id: model.id,
        label: model.label,
        status: model.status,
        model: model.model,
        warnings: model.warnings,
        suggestions: model.suggestions,
        confidence: model.confidence,
        timestamp: model.createdAt?.toISOString() || new Date().toISOString(),
        dnaType: model.userId === "user-123" ? "Architect" : "Alchemist" // Demo logic - in real app this would be stored
      }));
      
      res.json(dashboardModels);
    } catch (error) {
      console.error("Error retrieving dashboard models:", error);
      res.status(500).json({ error: "Failed to retrieve dashboard models" });
    }
  });

  // Get individual business model by ID (Module 5: Resume Wizard)
  app.get("/api/models/:modelId", async (req, res) => {
    try {
      const modelId = parseInt(req.params.modelId);
      
      if (isNaN(modelId)) {
        return res.status(400).json({ error: "Invalid model ID" });
      }

      const model = await storage.getBusinessModel(modelId);
      
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      // Mock answers for demo - in real app these would be stored with the model
      const mockAnswers = [
        "Digital marketing consultancy for small businesses",
        "Small businesses struggling with ineffective online marketing and low digital presence",
        "Small to medium business owners, entrepreneurs, and startups looking to grow their online presence",
        "There's an urgent need now as businesses recover post-pandemic and need strong digital strategies",
        "Comprehensive digital marketing audits, strategy development, and implementation support",
        "Monthly retainer model with performance-based bonuses for achieving specific KPIs",
        "Time investment, marketing tools, team training, and technology infrastructure costs",
        "Personalized approach combined with data-driven strategies and proven frameworks",
        "Competition from larger agencies and potential client budget constraints",
        "Marketing automation tools, CRM systems, and ongoing industry education and networking"
      ];

      const resumeData = {
        id: model.id,
        label: model.label,
        status: model.status,
        timestamp: model.createdAt?.toISOString() || new Date().toISOString(),
        dnaType: model.userId === "user-123" ? "Architect" : "Alchemist" as "Architect" | "Alchemist",
        answers: mockAnswers
      };
      
      res.json(resumeData);
    } catch (error) {
      console.error("Error retrieving individual model:", error);
      res.status(500).json({ error: "Failed to retrieve model" });
    }
  });

  // Business clarity endpoint (Module 1)
  app.post("/api/business-clarity", async (req, res) => {
    try {
      const clarityData = insertBusinessClaritySchema.parse(req.body);
      
      console.log(`[${new Date().toISOString()}] Saving business clarity for user ${clarityData.userId}`);
      console.log("Clarity data:", {
        dnaType: clarityData.dnaType,
        visionLength: clarityData.businessVision.length
      });

      const savedClarity = await storage.createBusinessClarity(clarityData);
      
      res.json({ 
        message: "Business clarity saved successfully",
        clarityId: savedClarity.id,
        savedAt: savedClarity.createdAt
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid clarity data",
          details: error.errors
        });
      }
      console.error("Error saving business clarity:", error);
      res.status(500).json({ error: "Failed to save business clarity" });
    }
  });

  // Get business clarity for user
  app.get("/api/business-clarity/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const clarity = await storage.getBusinessClarity(userId);
      
      if (!clarity) {
        return res.status(404).json({ error: "Business clarity not found" });
      }
      
      res.json(clarity);
    } catch (error) {
      console.error("Error retrieving business clarity:", error);
      res.status(500).json({ error: "Failed to retrieve business clarity" });
    }
  });

  // Product Design endpoint (Module 3)
  app.post("/api/product-design", async (req, res) => {
    try {
      const designData = insertProductDesignSchema.parse(req.body);
      
      console.log(`Saving product design for user ${designData.userId}`);
      console.log("Design data:", {
        architectLength: designData.productArchitect.length,
        alchemistLength: designData.productAlchemist.length,
        alignment: designData.alignmentRating
      });

      const savedDesign = await storage.createProductDesign(designData);
      
      res.json({ 
        message: "Product design saved successfully",
        designId: savedDesign.id,
        savedAt: savedDesign.createdAt
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid product design data",
          details: error.errors 
        });
      }
      console.error("Error saving product design:", error);
      res.status(500).json({ error: "Failed to save product design" });
    }
  });

  // Launch Plan endpoint (Module 4)
  app.post("/api/launch-plan", async (req, res) => {
    try {
      const planData = insertLaunchPlanSchema.parse({
        ...req.body,
        offerReady: req.body.launchChecklist.offerReady,
        audienceChannelKnown: req.body.launchChecklist.audienceChannelKnown,
        deliveryMethodMapped: req.body.launchChecklist.deliveryMethodMapped,
        paymentReady: req.body.launchChecklist.paymentReady,
      });
      
      console.log(`Saving launch plan for user ${planData.userId}`);
      console.log("Plan data:", {
        checklistItems: Object.keys(req.body.launchChecklist).length,
        readinessScore: planData.launchReadinessScore,
        reflectionsLength: planData.reflectionArchitect.length + planData.reflectionAlchemist.length
      });

      const savedPlan = await storage.createLaunchPlan(planData);
      
      res.json({ 
        message: "Launch plan saved successfully",
        planId: savedPlan.id,
        savedAt: savedPlan.createdAt
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid launch plan data",
          details: error.errors 
        });
      }
      console.error("Error saving launch plan:", error);
      res.status(500).json({ error: "Failed to save launch plan" });
    }
  });

  // Feedback Loop endpoint (Module 5)
  app.post("/api/feedback-loop", async (req, res) => {
    try {
      const loopData = insertFeedbackLoopSchema.parse(req.body);
      
      console.log(`Saving feedback loop for user ${loopData.userId}`);
      console.log("Loop data:", {
        feedbackStrategyLength: loopData.feedbackStrategy.length,
        insightsCount: loopData.topThreeInsights.filter(i => i.trim() !== "").length,
        improvementsLength: loopData.improveArchitect.length + loopData.improveAlchemist.length
      });

      const savedLoop = await storage.createFeedbackLoop(loopData);
      
      res.json({ 
        message: "Feedback loop saved successfully",
        loopId: savedLoop.id,
        savedAt: savedLoop.createdAt
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid feedback loop data",
          details: error.errors 
        });
      }
      console.error("Error saving feedback loop:", error);
      res.status(500).json({ error: "Failed to save feedback loop" });
    }
  });

  // Progress Tracker endpoint (Module 6)
  app.post("/api/progress-tracker", async (req, res) => {
    try {
      const trackerData = insertProgressTrackerSchema.parse(req.body);
      
      console.log(`Saving progress tracker for user ${trackerData.userId}`);
      console.log("Tracker data:", {
        modulesCount: trackerData.modulesCompleted.length,
        energyLevel: trackerData.energyLevel,
        reflectionsLength: trackerData.energyReflection.length + trackerData.dnaReflection.length
      });

      const savedTracker = await storage.createProgressTracker(trackerData);
      
      res.json({ 
        message: "Progress tracker saved successfully",
        trackerId: savedTracker.id,
        savedAt: savedTracker.createdAt
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid progress tracker data",
          details: error.errors 
        });
      }
      console.error("Error saving progress tracker:", error);
      res.status(500).json({ error: "Failed to save progress tracker" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
