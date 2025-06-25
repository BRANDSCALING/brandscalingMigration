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

  businessModels,
  uploadedWorkbooks,
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
  type BusinessModel,
  type InsertBusinessModel,
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
  getCoursesWithAccess(userId: string): Promise<Array<Course & { hasAccess: boolean; progress: number }>>;
  getCourseById(id: number): Promise<Course | undefined>;
  getCourseWithLessons(courseId: number, userId: string): Promise<any>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  
  // Lesson operations
  getLessonById(id: number): Promise<Lesson | undefined>;
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  getLessonWithCourse(lessonId: number, userId: string): Promise<any>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: number): Promise<void>;
  
  // Progress tracking
  markLessonComplete(userId: string, courseId: number, lessonId: number, viewMode: string): Promise<void>;
  getLessonProgress(userId: string, courseId: number, lessonId: number): Promise<{ completed: boolean; viewMode?: string }>;
  getUserProgress(userId: string): Promise<any[]>;
  getCourseProgress(userId: string, courseId: number): Promise<{ progress: number; completedLessons: number; totalLessons: number }>;
  
  // Student dashboard specific methods
  getUserPayments(userId: string): Promise<any[]>;
  getUserCourses(userId: string, accessTier: string): Promise<any[]>;
  getAnnouncements(limit?: number): Promise<any[]>;
  
  // Workbook methods
  getAllWorkbooks(): Promise<any[]>;
  getWorkbookById(id: number): Promise<any>;
  getUserWorkbookProgress(userId: string): Promise<any[]>;
  saveWorkbookProgress(userId: string, workbookId: number, responses: any, downloadUrl?: string): Promise<void>;
  saveUploadedWorkbook(userId: string, filename: string, originalName: string, fileType: string, fileUrl: string): Promise<any>;
  getPersonalizedDashboard(userId: string): Promise<any>;
  
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
  // Placeholder for authentic DNA interface methods
  
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
  
  // Business models
  createBusinessModel(model: InsertBusinessModel): Promise<BusinessModel>;
  getUserBusinessModels(userId: string): Promise<BusinessModel[]>;
  getBusinessModel(id: string, userId: string): Promise<BusinessModel | undefined>;
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

  async getCoursesWithAccess(userId: string): Promise<Array<Course & { hasAccess: boolean; progress: number }>> {
    const user = await this.getUser(userId);
    const userTier = user?.accessTier || 'beginner';
    
    const allCourses = await db.select().from(courses).where(eq(courses.isPublished, true));
    
    const coursesWithAccess = await Promise.all(
      allCourses.map(async (course) => {
        const hasAccess = this.checkTierAccess(userTier, course.accessTier as string);
        const progressData = await this.getCourseProgress(userId, course.id);
        
        return {
          ...course,
          hasAccess,
          progress: progressData.progress,
          completedLessons: progressData.completedLessons,
          totalLessons: progressData.totalLessons
        };
      })
    );
    
    return coursesWithAccess;
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCoursesForStudent(userId: string): Promise<any[]> {
    // Get user profile to check access tier
    const user = await this.getUserProfile(userId);
    const userTier = user?.accessTier || 'beginner';
    
    const allCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.isPublished, true))
      .orderBy(desc(courses.createdAt));
    
    const coursesWithAccess = await Promise.all(
      allCourses.map(async (course) => {
        const hasAccess = this.checkTierAccess(userTier, course.accessTier as string);
        const progressData = await this.getCourseProgress(userId, course.id);
        
        return {
          ...course,
          hasAccess,
          progress: progressData.progress,
          completedLessons: progressData.completedLessons,
          totalLessons: progressData.totalLessons
        };
      })
    );
    
    return coursesWithAccess;
  }

  async getCourseWithLessons(courseId: number, userId: string): Promise<any> {
    // Get course
    const course = await this.getCourseById(courseId);
    if (!course) return null;
    
    // Get lessons
    const lessons = await this.getLessonsByCourse(courseId);
    
    // Get progress
    const progressData = await this.getCourseProgress(userId, courseId);
    
    // Get user DNA type
    const user = await this.getUserProfile(userId);
    const userDnaType = user?.dominantType || 'Undeclared';
    
    return {
      ...course,
      lessons: lessons.map(lesson => ({
        ...lesson,
        completed: false // TODO: Get actual completion status
      })),
      progress: progressData.progress,
      completedLessons: progressData.completedLessons,
      totalLessons: progressData.totalLessons,
      userDnaType
    };
  }

  async getLessonById(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async getCourseWithLessons(courseId: number, userId: string): Promise<any> {
    const course = await this.getCourseById(courseId);
    if (!course) return null;
    
    const courseLessons = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.courseId, courseId), eq(lessons.isPublished, true)))
      .orderBy(lessons.order);
    
    const progressData = await this.getCourseProgress(userId, courseId);
    
    return {
      ...course,
      lessons: courseLessons,
      progress: progressData.progress,
      completedLessons: progressData.completedLessons,
      totalLessons: progressData.totalLessons
    };
  }

  // Lesson operations
  async getLessonById(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async getLessonWithCourse(lessonId: number, userId: string): Promise<any> {
    const lesson = await this.getLessonById(lessonId);
    if (!lesson) return null;
    
    const course = await this.getCourseById(lesson.courseId);
    if (!course) return null;
    
    // DNA personalization removed
    const dominantType = 'Undeclared';
    
    // Check if lesson is completed
    const progressData = await this.getLessonProgress(userId, lesson.courseId, lessonId);
    
    return {
      lesson: {
        ...lesson,
        completed: progressData.completed
      },
      course,
      userDnaType: dominantType,
      progress: progressData
    };
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

  async getCourseProgress(userId: string, courseId: number): Promise<{ progress: number; completedLessons: number; totalLessons: number }> {
    // Get total lessons in the course
    const totalLessonsResult = await db
      .select({ count: count() })
      .from(lessons)
      .where(and(eq(lessons.courseId, courseId), eq(lessons.isPublished, true)));
    
    const totalLessons = totalLessonsResult[0]?.count || 0;
    
    if (totalLessons === 0) {
      return { progress: 0, completedLessons: 0, totalLessons: 0 };
    }
    
    // Get user's progress for this course
    const [progressRecord] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)));
    
    const completedLessons = progressRecord?.currentModule || 0;
    const progress = Math.round((completedLessons / totalLessons) * 100);
    
    return { progress, completedLessons, totalLessons };
  }

  // Student dashboard methods
  async getUserPayments(userId: string): Promise<any[]> {
    // For now, return empty array - will be populated when payment system is integrated
    return [];
  }

  async getUserCourses(userId: string, accessTier: string): Promise<any[]> {
    const allCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.isPublished, true))
      .orderBy(asc(courses.id));

    return allCourses.filter(course => this.checkTierAccess(accessTier, course.requiredTier));
  }

  async getAnnouncements(limit: number = 5): Promise<any[]> {
    // For now, return empty array - will be populated when announcement system is integrated
    return [];
  }

  // Workbook methods
  async getAllWorkbooks(): Promise<any[]> {
    return await db
      .select()
      .from(workbooks)
      .where(eq(workbooks.isActive, true))
      .orderBy(asc(workbooks.difficulty), asc(workbooks.title));
  }

  async getWorkbookById(id: number): Promise<any> {
    const [workbook] = await db
      .select()
      .from(workbooks)
      .where(eq(workbooks.id, id));
    return workbook;
  }

  async getUserWorkbookProgress(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(userWorkbookProgress)
      .where(eq(userWorkbookProgress.userId, userId))
      .orderBy(desc(userWorkbookProgress.completedAt));
  }

  async saveWorkbookProgress(userId: string, workbookId: number, responses: any, downloadUrl?: string): Promise<void> {
    await db
      .insert(userWorkbookProgress)
      .values({
        userId,
        workbookId,
        responses,
        completedAt: new Date(),
        downloadUrl
      })
      .onConflictDoUpdate({
        target: [userWorkbookProgress.userId, userWorkbookProgress.workbookId],
        set: {
          responses,
          completedAt: new Date(),
          downloadUrl,
          updatedAt: new Date()
        }
      });
  }

  async saveUploadedWorkbook(userId: string, filename: string, originalName: string, fileType: string, fileUrl: string): Promise<any> {
    try {
      const [uploaded] = await db
        .insert(uploadedWorkbooks)
        .values({
          userId,
          filename,
          originalName,
          fileType,
          fileUrl,
          processingStatus: 'processing'
        })
        .returning();
      console.log('Saved workbook to database:', uploaded);
      return uploaded;
    } catch (error) {
      console.error('Error saving workbook:', error);
      throw error;
    }
  }

  async updateUploadedWorkbookStatus(id: number, status: string, extractedQuestions?: string[]): Promise<any> {
    try {
      const [updated] = await db
        .update(uploadedWorkbooks)
        .set({
          processingStatus: status,
          extractedQuestions: extractedQuestions || null
        })
        .where(eq(uploadedWorkbooks.id, id))
        .returning();
      console.log('Updated workbook status:', updated);
      return updated;
    } catch (error) {
      console.error('Error updating workbook status:', error);
      throw error;
    }
  }

  async getUploadedWorkbook(id: number): Promise<any> {
    const [workbook] = await db
      .select()
      .from(uploadedWorkbooks)
      .where(eq(uploadedWorkbooks.id, id));
    return workbook;
  }

  async getUserUploadedWorkbooks(userId: string): Promise<any[]> {
    try {
      return await db
        .select()
        .from(uploadedWorkbooks)
        .where(eq(uploadedWorkbooks.userId, userId))
        .orderBy(desc(uploadedWorkbooks.createdAt));
    } catch (error) {
      console.error('Error fetching uploaded workbooks:', error);
      return [];
    }
  }

  private checkTierAccess(userTier: string, requiredTier: string): boolean {
    const tierHierarchy = ['beginner', 'intermediate', 'advanced', 'mastermind'];
    const userTierIndex = tierHierarchy.indexOf(userTier);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
    
    return userTierIndex >= requiredTierIndex;
  }

  async getPersonalizedDashboard(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    // DNA result functionality removed
    
    // Get user's courses with progress
    const coursesWithProgress = await this.getCoursesWithAccess(userId);
    
    // Get recent progress
    const recentProgress = await this.getUserProgress(userId);
    
    // Get recommended courses - no DNA filtering
    const recommendedCourses = coursesWithProgress.slice(0, 3);
    
    // Get next lessons
    const inProgressCourses = coursesWithProgress.filter(course => 
      course.progress > 0 && course.progress < 100
    );
    
    return {
      userDnaResult: dnaResult ? {
        dominantType: dnaResult.defaultType,
        architect: dnaResult.architectScore,
        alchemist: dnaResult.alchemistScore,
        awarenessPercentage: dnaResult.awarenessPercentage
      } : null,
      userTier: user?.accessTier || 'beginner',
      recommendedCourses,
      recentProgress,
      inProgressCourses,
      coursesWithProgress
    };
  }

  // AI conversation methods
  async saveAiConversation(userId: string, userMessage: string, assistantResponse: string, dnaType: string): Promise<void> {
    const messages = [
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant', 
        content: assistantResponse,
        timestamp: new Date().toISOString()
      }
    ];
    
    await db.insert(aiConversations).values({
      userId,
      agentId: dnaType === 'architect' ? 1 : 2,
      messages: messages,
      role: dnaType
    });
  }

  async getRecentAiMessages(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const conversations = await db
        .select()
        .from(aiConversations)
        .where(eq(aiConversations.userId, userId))
        .orderBy(desc(aiConversations.createdAt))
        .limit(limit);
      
      // Extract messages from the conversations
      const allMessages = [];
      for (const conv of conversations) {
        if (conv.messages && Array.isArray(conv.messages)) {
          allMessages.push(...conv.messages);
        }
      }
      
      return allMessages.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent AI messages:', error);
      return [];
    }
  }

  async getAiConversationsByUser(userId: string, agentType?: string): Promise<any[]> {
    try {
      let query = db
        .select()
        .from(aiConversations)
        .where(eq(aiConversations.userId, userId));
      
      if (agentType) {
        query = query.where(eq(aiConversations.role, agentType));
      }
      
      const conversations = await query.orderBy(aiConversations.createdAt);
      
      // Extract and flatten messages from all conversations
      const allMessages = [];
      for (const conv of conversations) {
        if (conv.messages && Array.isArray(conv.messages)) {
          const messagesWithId = conv.messages.map((msg, index) => ({
            id: `${conv.id}-${index}`,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp || conv.createdAt,
            createdAt: conv.createdAt
          }));
          allMessages.push(...messagesWithId);
        }
      }
      
      return allMessages;
    } catch (error) {
      console.error('Error fetching AI conversations:', error);
      return [];
    }
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

  // Business model operations
  async createBusinessModel(modelData: InsertBusinessModel): Promise<BusinessModel> {
    const modelWithId = {
      id: generateId(),
      ...modelData
    };
    const [model] = await db
      .insert(businessModels)
      .values(modelWithId)
      .returning();
    return model;
  }

  async getUserBusinessModels(userId: string): Promise<BusinessModel[]> {
    return await db
      .select()
      .from(businessModels)
      .where(eq(businessModels.userId, userId))
      .orderBy(desc(businessModels.createdAt));
  }

  async getBusinessModel(id: string, userId: string): Promise<BusinessModel | undefined> {
    const [model] = await db
      .select()
      .from(businessModels)
      .where(and(eq(businessModels.id, id), eq(businessModels.userId, userId)));
    return model;
  }
}

export const storage = new DatabaseStorage();