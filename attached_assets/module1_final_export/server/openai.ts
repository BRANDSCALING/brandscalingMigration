import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    console.log("Generating AI response for prompt:", prompt.substring(0, 100) + "...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    console.log("OpenAI response content:", content ? content.substring(0, 100) + "..." : "null");
    
    return content || "No response generated";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate AI response. Please try again.");
  }
}

export async function enhanceBusinessConcept(prompt: string): Promise<{
  enhancedConcept: string;
  suggestions: string[];
  risks: string[];
  nextSteps: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a business strategist helping entrepreneurs refine their business concepts. Provide structured, actionable feedback in JSON format.",
        },
        {
          role: "user",
          content: `${prompt}\n\nPlease provide your response in JSON format with these fields:
          - enhancedConcept: A refined version of their business idea
          - suggestions: Array of 3-4 specific improvement suggestions
          - risks: Array of 2-3 potential risks or challenges
          - nextSteps: Array of 3-4 actionable next steps they should take`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    return {
      enhancedConcept: result.enhancedConcept || "No enhanced concept generated",
      suggestions: result.suggestions || [],
      risks: result.risks || [],
      nextSteps: result.nextSteps || [],
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to enhance business concept. Please try again.");
  }
}

export async function generateBrandingSuggestions(prompt: string): Promise<{
  businessNames: string[];
  taglines: string[];
  colorPalette: string[];
  brandTone: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a branding expert helping entrepreneurs create compelling brand identities. Provide structured branding suggestions in JSON format.",
        },
        {
          role: "user",
          content: `${prompt}\n\nPlease provide your response in JSON format with these fields:
          - businessNames: Array of 5 creative business name options
          - taglines: Array of 3 short, memorable taglines
          - colorPalette: Array of 4-5 hex color codes that work well together
          - brandTone: A brief description of the recommended brand personality`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    return {
      businessNames: result.businessNames || [],
      taglines: result.taglines || [],
      colorPalette: result.colorPalette || [],
      brandTone: result.brandTone || "No brand tone generated",
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate branding suggestions. Please try again.");
  }
}