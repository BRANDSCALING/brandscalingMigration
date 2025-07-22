import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("student"), // admin, student
  accessTier: varchar("access_tier").default("beginner"), // beginner, intermediate, advanced, mastermind
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  stripeId: varchar("stripe_id"), // Stripe session/payment ID
  stripePaidAt: timestamp("stripe_paid_at"), // Payment completion timestamp
  

  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Payment transactions
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  product: varchar("product").notNull(), // taster-day, mastermind, subscription, etc.
  stripeId: varchar("stripe_id").notNull(), // Stripe session/payment ID
  amount: integer("amount").notNull(), // Amount in pence
  paidAt: timestamp("paid_at").notNull().defaultNow(),
});

// LMS Modules table
export const lmsModules = pgTable("lms_modules", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  order: integer("order").notNull(),
  requiredTier: varchar("required_tier").notNull().default("beginner"), // beginner, intermediate, advanced, mastermind
  
  // Access control
  isLocked: boolean("is_locked").default(true),
  unlockAfterDays: integer("unlock_after_days").default(0), // Days after purchase to unlock
  
  // Architect content
  architectVideoUrl: varchar("architect_video_url"),
  architectWorkbookUrl: varchar("architect_workbook_url"),
  architectSummary: text("architect_summary"),
  
  // Alchemist content
  alchemistVideoUrl: varchar("alchemist_video_url"),
  alchemistWorkbookUrl: varchar("alchemist_workbook_url"),
  alchemistSummary: text("alchemist_summary"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User module progress table
export const lmsProgress = pgTable("lms_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: integer("module_id").notNull().references(() => lmsModules.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  viewMode: varchar("view_mode").notNull().default("architect"), // architect, alchemist
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    userModuleIdx: index("user_module_idx").on(table.userId, table.moduleId),
  };
});

// Course categories and tracks
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  track: varchar("track").notNull(), // architect, alchemist
  level: integer("level").notNull().default(1),
  imageUrl: varchar("image_url"),
  accessTier: varchar("access_tier").notNull().default("beginner"), // beginner, intermediate, advanced, mastermind
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course lessons with dual DNA perspectives
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: varchar("title").notNull(),
  description: text("description"),
  architectContent: text("architect_content"),
  alchemistContent: text("alchemist_content"),
  sharedContent: text("shared_content"),
  videoUrl: varchar("video_url"),
  architectVideoUrl: varchar("architect_video_url"),
  alchemistVideoUrl: varchar("alchemist_video_url"),
  workbookUrl: varchar("workbook_url"),
  requiredTier: varchar("required_tier").notNull().default("beginner"), // beginner, intermediate, advanced, mastermind
  order: integer("order").notNull().default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User course progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: real("progress").notNull().default(0), // 0-1
  currentModule: integer("current_module").default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community posts - Enhanced for admin management
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  tags: text("tags").array(),
  uploadUrls: text("upload_urls").array(),
  isPinned: boolean("is_pinned").default(false),
  pinnedAt: timestamp("pinned_at"),
  pinnedBy: varchar("pinned_by").references(() => users.id),
  featuredType: varchar("featured_type"), // launch, update, tip, warning, direction
  featuredAt: timestamp("featured_at"),
  featuredBy: varchar("featured_by").references(() => users.id),
  visibilityTier: varchar("visibility_tier").default("beginner"), // Controls who can see this post
  isHidden: boolean("is_hidden").default(false), // Admin can hide posts
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
});

// Post replies
export const postReplies = pgTable("post_replies", {
  id: varchar("id").primaryKey().notNull(),
  postId: varchar("post_id").notNull().references(() => posts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
});

// Post activity logs
export const postActivityLogs = pgTable("post_activity_logs", {
  id: varchar("id").primaryKey().notNull(),
  postId: varchar("post_id").notNull().references(() => posts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(), // view, like, comment, edit, undo
  timestamp: timestamp("timestamp").defaultNow(),
});

// Post edit history
export const postHistory = pgTable("post_history", {
  id: varchar("id").primaryKey().notNull(),
  postId: varchar("post_id").notNull().references(() => posts.id),
  oldTitle: text("old_title").notNull(),
  oldBody: text("old_body").notNull(),
  oldTags: text("old_tags").array(),
  editedAt: timestamp("edited_at").defaultNow(),
});

// Uploads
export const uploads = pgTable("uploads", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  url: text("url").notNull(),
  postId: varchar("post_id").references(() => posts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz/Assessment system
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  questions: jsonb("questions").notNull(), // array of questions with options
  requiredTier: varchar("required_tier").default("beginner"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User quiz results
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  answers: jsonb("answers").notNull(),
  score: real("score"),
  results: jsonb("results"), // detailed analysis
  createdAt: timestamp("created_at").defaultNow(),
});

// Business Models (Smart Business Builder)
export const businessModels = pgTable("business_models", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  dnaType: varchar("dna_type").notNull(), // architect, alchemist
  inputAnswers: jsonb("input_answers").notNull(), // 10 form answers
  gptOutput: jsonb("gpt_output"), // AI generated business model
  confidenceScore: integer("confidence_score"),
  title: varchar("title"), // user-given name for the model
  status: varchar("status").default("draft"), // draft, finalized
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Agents and prompts
export const aiAgents = pgTable("ai_agents", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  systemPrompt: text("system_prompt").notNull(),
  model: varchar("model").default("gpt-4o"),
  isActive: boolean("is_active").default(true),
  requiredTier: varchar("required_tier").default("beginner"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI conversations
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: integer("agent_id"),
  messages: jsonb("messages"), // array of message objects
  role: varchar("role"), // agent type identifier
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interactive Workbooks
export const workbooks = pgTable("workbooks", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  dnaTrack: varchar("dna_track").notNull(), // architect, alchemist, both
  questions: jsonb("questions").notNull(),
  estimatedTime: integer("estimated_time").notNull(),
  requiredTier: varchar("required_tier").default("beginner"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Workbook Progress
export const userWorkbookProgress = pgTable("user_workbook_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  workbookId: integer("workbook_id").notNull().references(() => workbooks.id),
  responses: jsonb("responses").notNull(),
  completedAt: timestamp("completed_at"),
  downloadUrl: text("download_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Uploaded Workbook Files
export const uploadedWorkbooks = pgTable("uploaded_workbooks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  fileType: varchar("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  processingStatus: varchar("processing_status").default("processing"), // processing, completed, failed
  extractedQuestions: text("extracted_questions").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email logs
export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // welcome, dna_complete, course_complete, weekly_digest
  recipient: varchar("recipient").notNull(),
  subject: varchar("subject").notNull(),
  status: varchar("status").notNull(), // sent, failed
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Placeholder for authentic DNA assessment schema - awaiting user specifications

// Workflow automation
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  trigger: varchar("trigger").notNull(), // user_signup, course_complete, etc.
  actions: jsonb("actions").notNull(), // array of actions
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Events and webinars
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  eventType: varchar("event_type").notNull(), // mastermind_call, workshop, etc.
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration"), // minutes
  meetingUrl: varchar("meeting_url"),
  requiredTier: varchar("required_tier").default("beginner"),
  maxAttendees: integer("max_attendees"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event attendees
export const eventAttendees = pgTable("event_attendees", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status").default("registered"), // registered, attended, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  summary: text("summary"),
  content: text("content"),
  tags: text("tags"), // comma-separated
  status: varchar("status").notNull().default("draft"), // draft, published
  authorId: varchar("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leads table for admin-added prospects
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  addedByAdmin: varchar("added_by_admin").notNull(), // Firebase UID of admin who added
  createdAt: timestamp("created_at").defaultNow(),
});

// Stripe purchases table for webhook tracking
export const stripePurchases = pgTable("stripe_purchases", {
  id: serial("id").primaryKey(),
  stripeSessionId: varchar("stripe_session_id").notNull().unique(),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  productName: varchar("product_name").notNull(),
  amountPaid: integer("amount_paid").notNull(), // Amount in cents
  referredByAdmin: varchar("referred_by_admin"), // Firebase UID if available
  emailSent: boolean("email_sent").default(false),
  emailSentAt: timestamp("email_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email campaign logs table (for lead email campaigns)
export const emailCampaignLogs = pgTable("email_campaign_logs", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id),
  subject: varchar("subject").notNull(),
  body: text("body").notNull(),
  sentBy: varchar("sent_by").notNull(), // Firebase UID of admin
  sentAt: timestamp("sent_at").defaultNow(),
});

// 7-Day Identity Reset Progress
export const sevenDayResetProgress = pgTable("seven_day_reset_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  day: integer("day").notNull(), // 1-7
  isStarted: boolean("is_started").default(false),
  isCompleted: boolean("is_completed").default(false),
  reflectionResponses: jsonb("reflection_responses"), // array of user responses to reflection prompts
  uploadedFiles: jsonb("uploaded_files"), // for Day 3 and 6 file uploads
  notes: text("notes"), // additional user notes
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Module 1 Workbook Session
export const workbookSessions = pgTable("workbook_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Business Filter (Section 1.1)
  businessFilter: jsonb("business_filter"), // { problem: boolean, person: boolean, profit: boolean, pull: boolean, customPrompt?: string, aiResponse?: string }
  
  // E-DNA Reflection (Section 1.2)
  ednaReflection: jsonb("edna_reflection"), // { architectReflection1?: string, architectReflection2?: string, alchemistReflection1?: string, alchemistReflection2?: string }
  
  // Clarity Prompts (Section 1.3)
  clarityPrompts: jsonb("clarity_prompts"), // { businessIdea?: string, audience?: string, problem?: string, transformation?: string, vehicle?: string, emotion?: string, blocker?: string }
  
  // Offer Builder (Section 1.4)
  offerBuilder: jsonb("offer_builder"), // { transformation?: string, vehicle?: string, price?: string, timeline?: string, delivery?: string }
  
  // Viability Scorecard (Section 1.5)
  viabilityScores: jsonb("viability_scores"), // { clarity: number, demand: number, differentiation: number, delivery: number, scalability: number, profitability: number, competition: number, energy: number }
  
  // Name Logo Builder (Section 1.6)
  nameLogoBuilder: jsonb("name_logo_builder"), // { finalDecisions?: { chosenBusinessName?: string, chosenTagline?: string, chosenColors?: string[] }, nameRatings?: Record<string, number> }
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 7-Day Reset Identity Contract (final result)
export const sevenDayResetContract = pgTable("seven_day_reset_contract", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  identityType: varchar("identity_type"), // Architect, Alchemist, or Hybrid
  contractText: text("contract_text").notNull(),
  nextActionStep: text("next_action_step"),
  signedAt: timestamp("signed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  posts: many(posts),
  postReplies: many(postReplies),
  quizResults: many(quizResults),
  conversations: many(aiConversations),
  eventAttendees: many(eventAttendees),
  blogPosts: many(blogPosts),
  sevenDayResetProgress: many(sevenDayResetProgress),
  sevenDayResetContract: many(sevenDayResetContract),
  workbookSessions: many(workbookSessions),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  replies: many(postReplies),
}));

export const postRepliesRelations = relations(postReplies, ({ one }) => ({
  post: one(posts, {
    fields: [postReplies.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postReplies.userId],
    references: [users.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userProgress.courseId],
    references: [courses.id],
  }),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizResults.quizId],
    references: [quizzes.id],
  }),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  attendees: many(eventAttendees),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendees.userId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const businessModelsRelations = relations(businessModels, ({ one }) => ({
  user: one(users, {
    fields: [businessModels.userId],
    references: [users.id],
  }),
}));

export const sevenDayResetProgressRelations = relations(sevenDayResetProgress, ({ one }) => ({
  user: one(users, {
    fields: [sevenDayResetProgress.userId],
    references: [users.id],
  }),
}));

export const sevenDayResetContractRelations = relations(sevenDayResetContract, ({ one }) => ({
  user: one(users, {
    fields: [sevenDayResetContract.userId],
    references: [users.id],
  }),
}));

export const workbookSessionsRelations = relations(workbookSessions, ({ one }) => ({
  user: one(users, {
    fields: [workbookSessions.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostReplySchema = createInsertSchema(postReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostActivityLogSchema = createInsertSchema(postActivityLogs).omit({
  id: true,
  timestamp: true,
});

export const insertPostHistorySchema = createInsertSchema(postHistory).omit({
  id: true,
  editedAt: true,
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});



export const insertAiAgentSchema = createInsertSchema(aiAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessModelSchema = createInsertSchema(businessModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSevenDayResetProgressSchema = createInsertSchema(sevenDayResetProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSevenDayResetContractSchema = createInsertSchema(sevenDayResetContract).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type PostReply = typeof postReplies.$inferSelect;
export type InsertPostReply = z.infer<typeof insertPostReplySchema>;

export type PostActivityLog = typeof postActivityLogs.$inferSelect;
export type InsertPostActivityLog = z.infer<typeof insertPostActivityLogSchema>;

export type PostHistory = typeof postHistory.$inferSelect;
export type InsertPostHistory = z.infer<typeof insertPostHistorySchema>;

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizResult = typeof quizResults.$inferSelect;

export type UserProgress = typeof userProgress.$inferSelect;

export type AiAgent = typeof aiAgents.$inferSelect;
export type InsertAiAgent = z.infer<typeof insertAiAgentSchema>;

export type AiConversation = typeof aiConversations.$inferSelect;

export type Workflow = typeof workflows.$inferSelect;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type EventAttendee = typeof eventAttendees.$inferSelect;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type BusinessModel = typeof businessModels.$inferSelect;
export type InsertBusinessModel = z.infer<typeof insertBusinessModelSchema>;

export type StripePurchase = typeof stripePurchases.$inferSelect;
export type InsertStripePurchase = typeof stripePurchases.$inferInsert;

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export type LmsModule = typeof lmsModules.$inferSelect;
export type InsertLmsModule = typeof lmsModules.$inferInsert;

export type LmsProgress = typeof lmsProgress.$inferSelect;
export type InsertLmsProgress = typeof lmsProgress.$inferInsert;

export type SevenDayResetProgress = typeof sevenDayResetProgress.$inferSelect;
export type InsertSevenDayResetProgress = z.infer<typeof insertSevenDayResetProgressSchema>;

export type SevenDayResetContract = typeof sevenDayResetContract.$inferSelect;
export type InsertSevenDayResetContract = z.infer<typeof insertSevenDayResetContractSchema>;

export type WorkbookSession = typeof workbookSessions.$inferSelect;
export type InsertWorkbookSession = typeof workbookSessions.$inferInsert;
