import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkbookSessionSchema, updateWorkbookSessionSchema } from "@shared/schema";
import { z } from "zod";
import { generateAIResponse, enhanceBusinessConcept, generateBrandingSuggestions } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get or create workbook session for current user (simplified - no auth for demo)
  app.get("/api/workbook/session", async (req, res) => {
    try {
      // For demo purposes, use user ID 1
      const userId = 1;
      
      let session = await storage.getWorkbookSessionByUser(userId);
      
      if (!session) {
        session = await storage.createWorkbookSession({ userId });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get workbook session" });
    }
  });

  // Update workbook session
  app.patch("/api/workbook/session/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateWorkbookSessionSchema.parse(req.body);
      
      const session = await storage.updateWorkbookSession(id, updates);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // AI clarity prompt endpoint with real OpenAI integration
  app.post("/api/workbook/clarity", async (req, res) => {
    try {
      const { businessIdea, audience, problem, transformation, vehicle, emotion, blocker } = req.body;
      
      const prompt = `I need help refining my business idea into a clear, scalable concept that combines clarity, strategy, and emotional resonance.

Here's what I've got so far:
• My business idea is: ${businessIdea || '[not specified]'}
• Who it's for: ${audience || '[not specified]'}
• The problem I want to solve: ${problem || '[not specified]'}
• The transformation or result I'm aiming for: ${transformation || '[not specified]'}
• What I might sell or deliver: ${vehicle || '[not specified]'}
• What I'd love the brand to feel like (emotionally): ${emotion || '[not specified]'}
• What's currently stopping me: ${blocker || '[not specified]'}

Now please help me:
1. Refine the idea into a clean, simple business concept
2. Suggest a logical delivery and monetization model
3. Highlight any major risks, missing pieces, or unclear points
4. Offer 2–3 ways I could test or launch this quickly
5. Use a tone and structure that balances logic and flow

Then, summarize the final idea in 5 bullet points.`;

      const response = await enhanceBusinessConcept(prompt);
      res.json(response);
    } catch (error) {
      console.error("Clarity endpoint error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate AI response" });
    }
  });

  // AI branding suggestions endpoint with real OpenAI integration
  app.post("/api/workbook/branding", async (req, res) => {
    try {
      const { businessDescription, targetAudience, brandTone, keyBenefits, industry } = req.body;
      
      const prompt = `I need help creating a name and logo concept for my business.

Here's my business:
• What I do: ${businessDescription || '[not specified]'}
• Who it's for: ${targetAudience || '[not specified]'}
• Key benefits: ${keyBenefits || '[not specified]'}
• Personality/tone: ${brandTone || '[not specified]'}
• Industry: ${industry || '[not specified]'}

Please suggest:
• 5 business name options (check domain availability)
• 3 logo concept directions (describe style, colors, symbols)
• 2 tagline options
• Color palette suggestions (include hex codes)

Make sure everything feels professional but approachable, and works for both digital and print.`;

      const response = await generateBrandingSuggestions(prompt);
      res.json(response);
    } catch (error) {
      console.error("Branding endpoint error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate branding suggestions" });
    }
  });

  // General AI prompt endpoint
  app.post("/api/workbook/ai-prompt", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: "Prompt is required and must be a string" });
      }

      console.log("AI prompt endpoint called with prompt length:", prompt.length);
      const response = await generateAIResponse(prompt);
      console.log("Generated response:", response ? response.substring(0, 100) + "..." : "null");
      res.json({ response });
    } catch (error) {
      console.error("AI prompt endpoint error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate AI response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
