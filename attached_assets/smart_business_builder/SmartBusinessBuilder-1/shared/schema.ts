import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  moduleId: text("module_id").notNull().unique(),
  title: text("title").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  moduleId: text("module_id").notNull(),
  completed: boolean("completed").default(false),
  videoArchitectCompleted: boolean("video_architect_completed").default(false),
  videoAlchemistCompleted: boolean("video_alchemist_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessModels = pgTable("business_models", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(),
  model: text("model").notNull(),
  warnings: text("warnings"),
  suggestions: text("suggestions"),
  confidence: integer("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessClarity = pgTable("business_clarity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessVision: text("business_vision").notNull(),
  dnaType: text("dna_type").notNull(), // 'Architect' | 'Alchemist'
  createdAt: timestamp("created_at").defaultNow(),
});

export const productDesign = pgTable("product_design", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productArchitect: text("product_architect").notNull(),
  productAlchemist: text("product_alchemist").notNull(),
  alignmentRating: integer("alignment_rating").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const launchPlan = pgTable("launch_plan", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  offerReady: boolean("offer_ready").notNull().default(false),
  audienceChannelKnown: boolean("audience_channel_known").notNull().default(false),
  deliveryMethodMapped: boolean("delivery_method_mapped").notNull().default(false),
  paymentReady: boolean("payment_ready").notNull().default(false),
  launchReadinessScore: integer("launch_readiness_score").notNull(),
  reflectionArchitect: text("reflection_architect").notNull(),
  reflectionAlchemist: text("reflection_alchemist").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedbackLoop = pgTable("feedback_loop", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  feedbackStrategy: text("feedback_strategy").notNull(),
  topThreeInsights: text("top_three_insights").array().notNull(),
  improveArchitect: text("improve_architect").notNull(),
  improveAlchemist: text("improve_alchemist").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const progressTracker = pgTable("progress_tracker", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  modulesCompleted: integer("modules_completed").array().notNull(),
  energyLevel: integer("energy_level").notNull(),
  energyReflection: text("energy_reflection").notNull(),
  dnaReflection: text("dna_reflection").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessModelSchema = createInsertSchema(businessModels).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessClaritySchema = createInsertSchema(businessClarity).omit({
  id: true,
  createdAt: true,
});

export const insertProductDesignSchema = createInsertSchema(productDesign).omit({
  id: true,
  createdAt: true,
});

export const insertLaunchPlanSchema = createInsertSchema(launchPlan).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackLoopSchema = createInsertSchema(feedbackLoop).omit({
  id: true,
  createdAt: true,
});

export const insertProgressTrackerSchema = createInsertSchema(progressTracker).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type BusinessModel = typeof businessModels.$inferSelect;
export type InsertBusinessModel = z.infer<typeof insertBusinessModelSchema>;
export type BusinessClarity = typeof businessClarity.$inferSelect;
export type InsertBusinessClarity = z.infer<typeof insertBusinessClaritySchema>;
export type ProductDesign = typeof productDesign.$inferSelect;
export type InsertProductDesign = z.infer<typeof insertProductDesignSchema>;
export type LaunchPlan = typeof launchPlan.$inferSelect;
export type InsertLaunchPlan = z.infer<typeof insertLaunchPlanSchema>;
export type FeedbackLoop = typeof feedbackLoop.$inferSelect;
export type InsertFeedbackLoop = z.infer<typeof insertFeedbackLoopSchema>;
export type ProgressTracker = typeof progressTracker.$inferSelect;
export type InsertProgressTracker = z.infer<typeof insertProgressTrackerSchema>;
