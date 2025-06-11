import { db } from "./db";
import { eq, desc, asc, count, and, or, sql, isNull, isNotNull } from "drizzle-orm";
import { 
  users, 
  posts, 
  postReplies, 
  lmsModules, 
  lmsProgress, 
  quizResults, 
  events, 
  blogPosts, 
  aiAgents,
  aiConversations,
  courses,
  lessons,
  userProgress,
  leads,
  stripePurchases,
  payments,
  emailLogs,
  dnaResults,
  entrepreneurialDnaQuizResponses,
  type User,
  type UpsertUser,
  type Post,
  type PostReply,
  type LmsModule,
  type LmsProgress,
  type QuizResult,
  type Event,
  type BlogPost,
  type AiAgent,
  type Course,
  type InsertCourse,
  type Lesson,
  type InsertLesson,
  type Lead,
  type InsertLead,
  type StripePurchase,
  type InsertStripePurchase,
  type EmailLog,
  type InsertEmailLog,
  insertUserDnaResultSchema
} from "@shared/schema";

// Simple ID generator
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

type CommunityPost = Post & { user: User };

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  
  // Lesson operations
  getLessonById(id: number): Promise<Lesson | undefined>;
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: number): Promise<void>;
  
  // Progress tracking
  markLessonComplete(userId: string, courseId: number, lessonId: number, viewMode: string): Promise<void>;
  getLessonProgress(userId: string, courseId: number, lessonId: number): Promise<{ completed: boolean; viewMode?: string }>;
  getUserProgress(userId: string): Promise<any[]>;
  
  // AI conversation methods
  saveAiConversation(userId: string, userMessage: string, assistantResponse: string, dnaType: string): Promise<void>;
  getRecentAiMessages(userId: string, limit?: number): Promise<any[]>;
  getAiConversationsByUser(userId: string): Promise<any[]>;
  
  // Email logging
  logEmail(emailData: {
    userId: string;
    type: string;
    recipient: string;
    subject: string;
    status: string;
    error?: string;
  }): Promise<void>;
  
  // DNA assessment
  upsertUserDnaResult(userId: string, result: string, percentages?: any): Promise<void>;
  getUserDnaResult(userId: string): Promise<any>;
  
  // User management
  getAllActiveUsers(): Promise<User[]>;
  
  // Community posts
  getAllPosts(): Promise<CommunityPost[]>;
  createPost(post: any): Promise<Post>;
  updatePost(id: string, updates: any): Promise<Post>;
  deletePost(id: string): Promise<void>;
  createPostReply(reply: any): Promise<PostReply>;
  
  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  updateLead(id: number, updates: any): Promise<Lead>;
  deleteLead(id: number): Promise<void>;
  
  // Events
  getAllEvents(): Promise<Event[]>;
  createEvent(event: any): Promise<Event>;
  updateEvent(id: number, updates: any): Promise<Event>;
  deleteEvent(id: number): Promise<void>;
  
  // Blog posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: any): Promise<BlogPost>;
  updateBlogPost(id: number, updates: any): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(asc(courses.id));
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async updateCourse(id: number, courseData: Partial<InsertCourse>): Promise<Course> {
    const [course] = await db
      .update(courses)
      .set({ ...courseData, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Lesson operations
  async getLessonById(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.order));
  }

  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(lessonData).returning();
    return lesson;
  }

  async updateLesson(id: number, lessonData: Partial<InsertLesson>): Promise<Lesson> {
    const [lesson] = await db
      .update(lessons)
      .set({ ...lessonData, updatedAt: new Date() })
      .where(eq(lessons.id, id))
      .returning();
    return lesson;
  }

  async deleteLesson(id: number): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // Progress tracking
  async markLessonComplete(userId: string, courseId: number, lessonId: number, viewMode: string): Promise<void> {
    await db
      .insert(userProgress)
      .values({
        userId,
        courseId,
        progress: 100,
        completedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.courseId],
        set: {
          completedAt: new Date(),
          progress: 100
        }
      });
  }

  async getLessonProgress(userId: string, courseId: number, lessonId: number): Promise<{ completed: boolean; viewMode?: string }> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.courseId, courseId)
        )
      );
    return progress ? { completed: true, viewMode: 'completed' } : { completed: false };
  }

  async getUserProgress(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.completedAt));
  }

  // AI conversation methods
  async saveAiConversation(userId: string, userMessage: string, assistantResponse: string, dnaType: string): Promise<void> {
    await db.insert(aiConversations).values([
      {
        userId,
        role: 'user',
        content: userMessage,
        dnaType
      },
      {
        userId,
        role: 'assistant',
        content: assistantResponse,
        dnaType
      }
    ]);
  }

  async getRecentAiMessages(userId: string, limit: number = 10): Promise<any[]> {
    return await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.createdAt))
      .limit(limit);
  }

  async getAiConversationsByUser(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(aiConversations.createdAt);
  }

  // Email logging
  async logEmail(emailData: {
    userId: string;
    type: string;
    recipient: string;
    subject: string;
    status: string;
    error?: string;
  }): Promise<void> {
    await db.insert(emailLogs).values(emailData);
  }

  // DNA assessment
  async upsertUserDnaResult(userId: string, result: string, percentages?: any): Promise<void> {
    await db
      .insert(dnaResults)
      .values({
        userId,
        result,
        percentages,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: dnaResults.userId,
        set: {
          result,
          percentages,
          updatedAt: new Date()
        }
      });
  }

  async getUserDnaResult(userId: string): Promise<any> {
    const [result] = await db
      .select()
      .from(dnaResults)
      .where(eq(dnaResults.userId, userId));
    return result;
  }

  // Entrepreneurial DNA Quiz methods
  async saveEntrepreneurialDnaQuizResponse(
    userId: string,
    answers: Record<number, string>,
    defaultType: string,
    awarenessPercentage: number,
    scores: {
      architect: number;
      alchemist: number;
      blurred: number;
      awareness: number;
    }
  ): Promise<void> {
    const nextRetakeDate = new Date();
    nextRetakeDate.setDate(nextRetakeDate.getDate() + 30);

    await db
      .insert(entrepreneurialDnaQuizResponses)
      .values({
        userId,
        answers,
        defaultType,
        awarenessPercentage,
        architectScore: scores.architect,
        alchemistScore: scores.alchemist,
        blurredScore: scores.blurred,
        awarenessScore: scores.awareness,
        canRetake: false,
        nextRetakeDate,
        updatedAt: new Date()
      });
  }

  async getLatestEntrepreneurialDnaQuizResponse(userId: string): Promise<any> {
    const [response] = await db
      .select()
      .from(entrepreneurialDnaQuizResponses)
      .where(eq(entrepreneurialDnaQuizResponses.userId, userId))
      .orderBy(desc(entrepreneurialDnaQuizResponses.createdAt))
      .limit(1);
    return response;
  }

  async checkEntrepreneurialDnaQuizEligibility(userId: string): Promise<{ canRetake: boolean; nextRetakeDate?: string }> {
    const latest = await this.getLatestEntrepreneurialDnaQuizResponse(userId);
    
    if (!latest) {
      return { canRetake: true };
    }

    const now = new Date();
    const nextRetakeDate = new Date(latest.nextRetakeDate);
    
    if (now >= nextRetakeDate) {
      return { canRetake: true };
    }

    return {
      canRetake: false,
      nextRetakeDate: latest.nextRetakeDate
    };
  }

  // User management
  async getAllActiveUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(isNotNull(users.email));
  }

  // Community posts
  async getAllPosts(): Promise<CommunityPost[]> {
    return await db
      .select({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        body: posts.body,
        tags: posts.tags,
        uploadUrls: posts.uploadUrls,
        isPinned: posts.isPinned,
        pinnedAt: posts.pinnedAt,
        pinnedBy: posts.pinnedBy,
        likeCount: posts.likeCount,
        replyCount: posts.replyCount,
        viewCount: posts.viewCount,
        lastActivity: posts.lastActivity,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        isDeleted: posts.isDeleted,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.isDeleted, false))
      .orderBy(desc(posts.lastActivity)) as CommunityPost[];
  }

  async createPost(postData: any): Promise<Post> {
    const [post] = await db.insert(posts).values({
      id: generateId(),
      ...postData,
    }).returning();
    return post;
  }

  async updatePost(id: string, updates: any): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: string): Promise<void> {
    await db
      .update(posts)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));
  }

  async createPostReply(replyData: any): Promise<PostReply> {
    const [reply] = await db.insert(postReplies).values({
      id: generateId(),
      ...replyData,
    }).returning();
    return reply;
  }

  // Lead management
  async createLead(leadData: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(leadData).returning();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async updateLead(id: number, updates: any): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  // Events
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(asc(events.scheduledAt));
  }

  async createEvent(eventData: any): Promise<Event> {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  async updateEvent(id: number, updates: any): Promise<Event> {
    const [event] = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Blog posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async createBlogPost(postData: any): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(postData).returning();
    return post;
  }

  async updateBlogPost(id: number, updates: any): Promise<BlogPost> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();