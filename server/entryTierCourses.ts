import { db } from "./db";
import { courses, lessons } from "@shared/schema";
import { eq } from "drizzle-orm";

// Entry Tier Course Data - Based on attached PDFs
export async function seedEntryTierCourses() {
  try {
    console.log('Seeding Entry Tier courses...');

    // Check if Entry tier courses already exist
    const existingEntryCourses = await db.select().from(courses)
      .where(eq(courses.accessTier, "beginner"))
      .limit(1);
    
    if (existingEntryCourses.length > 0) {
      console.log('Entry tier courses already exist, skipping seed');
      return;
    }

    // 1. Idea-to-Launch Kit™
    const ideaToLaunchCourse = await db.insert(courses).values({
      title: "Idea-to-Launch Kit™",
      description: "A founder's complete startup execution system — designed for UK entrepreneurs ready to stop guessing and start building.",
      track: "architect",
      level: 1,
      accessTier: "beginner",
      isPublished: true
    }).returning();

    // Add modules for Idea-to-Launch Kit™
    await db.insert(lessons).values([
      {
        courseId: ideaToLaunchCourse[0].id,
        title: "Business Clarity Engine™",
        description: "Extract and validate a launchable business idea",
        architectContent: "Strategic approach to idea validation with data-driven analysis and market research frameworks.",
        alchemistContent: "Intuitive idea discovery process focusing on passion alignment and personal vision clarity.",
        sharedContent: "Use the 4-Part Viable Business Idea Filter to test your concept across Problem, Person, Profit, and Pull dimensions.",
        requiredTier: "beginner",
        order: 1,
        isPublished: true
      },
      {
        courseId: ideaToLaunchCourse[0].id,
        title: "Name & Brand Identity Fast Track",
        description: "Instantly generate names, logos, colors, and brand presence",
        architectContent: "Systematic brand development using proven frameworks and scalable design systems.",
        alchemistContent: "Creative brand storytelling and emotional resonance building for magnetic attraction.",
        sharedContent: "Complete brand identity creation including name generation, visual identity, and brand voice development.",
        requiredTier: "beginner",
        order: 2,
        isPublished: true
      },
      {
        courseId: ideaToLaunchCourse[0].id,
        title: "Structure & Setup Layer",
        description: "Legally launch your business with full setup and compliance",
        architectContent: "Step-by-step business registration, legal compliance, and operational infrastructure setup.",
        alchemistContent: "Streamlined business setup focusing on energy alignment and simplified administrative processes.",
        sharedContent: "UK-specific business registration guide covering Sole Trader vs LTD, VAT, banking, and legal requirements.",
        requiredTier: "beginner",
        order: 3,
        isPublished: true
      },
      {
        courseId: ideaToLaunchCourse[0].id,
        title: "Financial Foundations",
        description: "Create a clean, trackable money system from day one",
        architectContent: "Comprehensive financial system setup with accounting software integration and cash flow management.",
        alchemistContent: "Simplified money management focusing on clarity and confidence in financial decisions.",
        sharedContent: "Business banking, payment processing, invoicing, and basic bookkeeping systems setup.",
        requiredTier: "beginner",
        order: 4,
        isPublished: true
      },
      {
        courseId: ideaToLaunchCourse[0].id,
        title: "Your Digital Presence",
        description: "Get online fast with domains, hosting, email, and landing page",
        architectContent: "Technical website setup with optimization for conversion and scalability.",
        alchemistContent: "Creative web presence focusing on authentic expression and magnetic attraction.",
        sharedContent: "Complete digital presence setup including domain, hosting, professional email, and landing page creation.",
        requiredTier: "beginner",
        order: 5,
        isPublished: true
      },
      {
        courseId: ideaToLaunchCourse[0].id,
        title: "Brand Presence Boot-Up",
        description: "Launch social channels + establish public credibility",
        architectContent: "Strategic social media setup with content planning and consistent brand presence.",
        alchemistContent: "Authentic social presence creation focusing on genuine connection and community building.",
        sharedContent: "Social media setup, profile optimization, content strategy, and brand consistency across platforms.",
        requiredTier: "beginner",
        order: 6,
        isPublished: true
      },
      {
        courseId: ideaToLaunchCourse[0].id,
        title: "Execution Planner & AI Toolkit",
        description: "Your 30-day step-by-step execution planner + AI vault",
        architectContent: "Systematic project management with milestone tracking and performance metrics.",
        alchemistContent: "Intuitive planning approach with flexibility and adaptive execution strategies.",
        sharedContent: "30-day launch plan with daily tasks, AI prompts, and execution templates for rapid implementation.",
        requiredTier: "beginner",
        order: 7,
        isPublished: true
      }
    ]);

    // 2. Smart Business Builder™
    const smartBusinessCourse = await db.insert(courses).values({
      title: "Smart Business Builder™",
      description: "AI-personalized Lean Canvas alternative based on your Entrepreneurial DNA",
      track: "alchemist",
      level: 1,
      accessTier: "beginner",
      isPublished: true
    }).returning();

    await db.insert(lessons).values([
      {
        courseId: smartBusinessCourse[0].id,
        title: "E-DNA Business Model Design",
        description: "Create your personalized business model based on your Entrepreneurial DNA",
        architectContent: "Structured business model canvas with logical frameworks and systematic validation processes.",
        alchemistContent: "Intuitive business model creation focusing on energy alignment and natural flow patterns.",
        sharedContent: "Personalized business model development using your E-DNA results to create an aligned and effective structure.",
        requiredTier: "beginner",
        order: 1,
        isPublished: true
      },
      {
        courseId: smartBusinessCourse[0].id,
        title: "AI-Powered Strategy Development",
        description: "Use AI tools to accelerate your business planning and strategy creation",
        architectContent: "Systematic AI integration for business planning, market analysis, and strategic decision-making.",
        alchemistContent: "Creative AI collaboration for vision development and innovative problem-solving approaches.",
        sharedContent: "Complete AI toolkit with prompts, templates, and workflows for accelerated business development.",
        requiredTier: "beginner",
        order: 2,
        isPublished: true
      }
    ]);

    // 3. AI Mentor Access
    const aiMentorCourse = await db.insert(courses).values({
      title: "AI Mentor Access",
      description: "Get personalized guidance from AI mentors trained on your Entrepreneurial DNA",
      track: "architect",
      level: 1,
      accessTier: "beginner",
      isPublished: true
    }).returning();

    await db.insert(lessons).values([
      {
        courseId: aiMentorCourse[0].id,
        title: "AI Mentor Introduction",
        description: "Learn how to effectively communicate with your AI mentors",
        architectContent: "Structured approach to AI interaction with clear frameworks for productive conversations.",
        alchemistContent: "Intuitive AI collaboration focusing on creative exploration and emotional intelligence.",
        sharedContent: "Complete guide to working with AI mentors including prompt engineering and conversation strategies.",
        requiredTier: "beginner",
        order: 1,
        isPublished: true
      },
      {
        courseId: aiMentorCourse[0].id,
        title: "Personalized Business Coaching",
        description: "Get ongoing support tailored to your DNA type and business challenges",
        architectContent: "Systematic coaching framework with measurable goals and progress tracking.",
        alchemistContent: "Intuitive coaching approach focusing on personal growth and authentic expression.",
        sharedContent: "Access to personalized AI coaching sessions designed around your specific DNA type and business needs.",
        requiredTier: "beginner",
        order: 2,
        isPublished: true
      }
    ]);

    // 4. 30-Day Launch Plan
    const launchPlanCourse = await db.insert(courses).values({
      title: "30-Day Launch Plan",
      description: "Step-by-step execution plan to launch your business in 30 days",
      track: "alchemist",
      level: 1,
      accessTier: "beginner",
      isPublished: true
    }).returning();

    await db.insert(lessons).values([
      {
        courseId: launchPlanCourse[0].id,
        title: "Week 1: Foundation & Setup",
        description: "Build your business foundation and complete essential setup tasks",
        architectContent: "Systematic week-by-week breakdown with clear deliverables and progress checkpoints.",
        alchemistContent: "Energetic approach to launch preparation focusing on momentum building and motivation.",
        sharedContent: "Week 1 tasks: Business registration, banking setup, domain purchase, and brand identity creation.",
        requiredTier: "beginner",
        order: 1,
        isPublished: true
      },
      {
        courseId: launchPlanCourse[0].id,
        title: "Week 2: Digital Presence & Content",
        description: "Create your online presence and prepare launch content",
        architectContent: "Structured content creation with SEO optimization and conversion-focused design.",
        alchemistContent: "Authentic content creation focusing on storytelling and emotional connection.",
        sharedContent: "Week 2 tasks: Website creation, social media setup, content calendar, and launch materials.",
        requiredTier: "beginner",
        order: 2,
        isPublished: true
      },
      {
        courseId: launchPlanCourse[0].id,
        title: "Week 3: Testing & Refinement",
        description: "Test your systems and refine your offering based on feedback",
        architectContent: "Data-driven testing protocols with metrics tracking and systematic optimization.",
        alchemistContent: "Intuitive refinement process based on energy feedback and authentic alignment.",
        sharedContent: "Week 3 tasks: System testing, feedback collection, offer refinement, and launch preparation.",
        requiredTier: "beginner",
        order: 3,
        isPublished: true
      },
      {
        courseId: launchPlanCourse[0].id,
        title: "Week 4: Launch & Scale",
        description: "Execute your launch and set up systems for growth",
        architectContent: "Systematic launch execution with performance tracking and scaling frameworks.",
        alchemistContent: "Momentum-based launch approach focusing on celebration and sustainable growth.",
        sharedContent: "Week 4 tasks: Launch execution, customer acquisition, feedback integration, and growth planning.",
        requiredTier: "beginner",
        order: 4,
        isPublished: true
      }
    ]);

    console.log('Entry tier courses seeded successfully');
  } catch (error) {
    console.error('Error seeding Entry tier courses:', error);
  }
}