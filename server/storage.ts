import {
  users,
  courses,
  posts,
  postReplies,
  quizzes,
  quizResults,
  userProgress,
  aiAgents,
  aiConversations,
  events,
  eventAttendees,
  workflows,
  blogPosts,
  lmsModules,
  lmsProgress,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Post,
  type InsertPost,
  type PostReply,
  type Quiz,
  type InsertQuiz,
  type QuizResult,
  type UserProgress,
  type AiAgent,
  type InsertAiAgent,
  type AiConversation,
  type Event,
  type InsertEvent,
  type EventAttendee,
  type Workflow,
  type BlogPost,
  type InsertBlogPost,
  type LmsModule,
  type InsertLmsModule,
  type LmsProgress,
  type InsertLmsProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;
  updateUserAssessment(userId: string, assessment: {
    architectScore: number;
    alchemistScore: number;
    readinessScore: number;
    dominantType: string;
    readinessLevel: string;
    tags: string;
    assessmentComplete: boolean;
  }): Promise<User>;

  // Course operations
  getCourses(track?: string): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;

  // User progress
  getUserProgress(userId: string, courseId?: number): Promise<UserProgress[]>;
  updateUserProgress(userId: string, courseId: number, progress: number, currentModule?: number): Promise<UserProgress>;

  // Community operations
  getPosts(limit?: number): Promise<(Post & { user: User; replies: PostReply[] })[]>;
  getPost(id: number): Promise<(Post & { user: User; replies: (PostReply & { user: User })[] }) | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  createPostReply(postId: number, userId: string, content: string): Promise<PostReply>;
  likePost(postId: number): Promise<void>;

  // Quiz operations
  getQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getUserQuizResults(userId: string, quizId?: number): Promise<QuizResult[]>;
  saveQuizResult(userId: string, quizId: number, answers: any, score: number, results?: any): Promise<QuizResult>;

  // AI Agent operations
  getAiAgents(): Promise<AiAgent[]>;
  getAiAgent(id: number): Promise<AiAgent | undefined>;
  createAiAgent(agent: InsertAiAgent): Promise<AiAgent>;
  updateAiAgent(id: number, agent: Partial<InsertAiAgent>): Promise<AiAgent>;
  
  // AI Conversations
  getConversation(userId: string, agentId: number): Promise<AiConversation | undefined>;
  createOrUpdateConversation(userId: string, agentId: number, messages: any[]): Promise<AiConversation>;

  // Events
  getUpcomingEvents(userId: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  registerForEvent(eventId: number, userId: string): Promise<EventAttendee>;

  // Workflows
  getActiveWorkflows(): Promise<Workflow[]>;
  
  // Blog operations
  getBlogPosts(publishedOnly?: boolean): Promise<(BlogPost & { author: User })[]>;
  getBlogPost(id: number): Promise<(BlogPost & { author: User }) | undefined>;
  getBlogPostBySlug(slug: string): Promise<(BlogPost & { author: User }) | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;

  // LMS operations
  getLmsModules(): Promise<LmsModule[]>;
  getLmsModulesWithAccess(userId: string): Promise<(LmsModule & { isAccessible: boolean; unlockDate?: Date })[]>;
  getLmsModule(id: number): Promise<LmsModule | undefined>;
  createLmsModule(module: InsertLmsModule): Promise<LmsModule>;
  updateLmsModule(id: number, module: Partial<InsertLmsModule>): Promise<LmsModule>;
  getUserLmsProgress(userId: string): Promise<LmsProgress[]>;
  updateUserLmsProgress(userId: string, moduleId: number, completed: boolean): Promise<LmsProgress>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: string): Promise<User>;
  updateUserAccessTier(userId: string, accessTier: string): Promise<User>;
  getSystemStats(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalPosts: number;
    activeEvents: number;
    totalBlogPosts: number;
  }>;
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

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserAssessment(userId: string, assessment: {
    architectScore: number;
    alchemistScore: number;
    readinessScore: number;
    dominantType: string;
    readinessLevel: string;
    tags: string;
    assessmentComplete: boolean;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        architectScore: assessment.architectScore,
        alchemistScore: assessment.alchemistScore,
        readinessScore: assessment.readinessScore,
        dominantType: assessment.dominantType,
        readinessLevel: assessment.readinessLevel,
        tags: assessment.tags,
        assessmentComplete: assessment.assessmentComplete,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Course operations
  async getCourses(track?: string): Promise<Course[]> {
    if (track) {
      return await db.select().from(courses).where(and(eq(courses.isPublished, true), eq(courses.track, track)));
    }
    return await db.select().from(courses).where(eq(courses.isPublished, true));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  // User progress
  async getUserProgress(userId: string, courseId?: number): Promise<UserProgress[]> {
    const query = db.select().from(userProgress).where(eq(userProgress.userId, userId));
    if (courseId) {
      return await query.where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)));
    }
    return await query;
  }

  async updateUserProgress(userId: string, courseId: number, progress: number, currentModule?: number): Promise<UserProgress> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)));

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set({
          progress,
          currentModule,
          completedAt: progress >= 1 ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          courseId,
          progress,
          currentModule,
          completedAt: progress >= 1 ? new Date() : null,
        })
        .returning();
      return newProgress;
    }
  }

  // Community operations
  async getPosts(limit = 20): Promise<(Post & { user: User; replies: PostReply[] })[]> {
    const postsWithUsers = await db
      .select()
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.isPublished, true))
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    const result = [];
    for (const { posts: post, users: user } of postsWithUsers) {
      const replies = await db
        .select()
        .from(postReplies)
        .where(eq(postReplies.postId, post.id))
        .orderBy(desc(postReplies.createdAt));

      result.push({
        ...post,
        user,
        replies,
      });
    }

    return result;
  }

  async getPost(id: number): Promise<(Post & { user: User; replies: (PostReply & { user: User })[] }) | undefined> {
    const [postWithUser] = await db
      .select()
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id));

    if (!postWithUser) return undefined;

    const repliesWithUsers = await db
      .select()
      .from(postReplies)
      .innerJoin(users, eq(postReplies.userId, users.id))
      .where(eq(postReplies.postId, id))
      .orderBy(desc(postReplies.createdAt));

    return {
      ...postWithUser.posts,
      user: postWithUser.users,
      replies: repliesWithUsers.map(({ post_replies, users }) => ({
        ...post_replies,
        user: users,
      })),
    };
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async createPostReply(postId: number, userId: string, content: string): Promise<PostReply> {
    const [reply] = await db
      .insert(postReplies)
      .values({ postId, userId, content })
      .returning();

    // Update reply count
    await db
      .update(posts)
      .set({ replies: sql`${posts.replies} + 1` })
      .where(eq(posts.id, postId));

    return reply;
  }

  async likePost(postId: number): Promise<void> {
    await db
      .update(posts)
      .set({ likes: sql`${posts.likes} + 1` })
      .where(eq(posts.id, postId));
  }

  // Quiz operations
  async getQuizzes(): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.isPublished, true));
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async getUserQuizResults(userId: string, quizId?: number): Promise<QuizResult[]> {
    const query = db.select().from(quizResults).where(eq(quizResults.userId, userId));
    if (quizId) {
      return await query.where(and(eq(quizResults.userId, userId), eq(quizResults.quizId, quizId)));
    }
    return await query;
  }

  async saveQuizResult(userId: string, quizId: number, answers: any, score: number, results?: any): Promise<QuizResult> {
    const [result] = await db
      .insert(quizResults)
      .values({
        userId,
        quizId,
        answers,
        score,
        results,
      })
      .returning();
    return result;
  }

  // AI Agent operations
  async getAiAgents(): Promise<AiAgent[]> {
    return await db.select().from(aiAgents).where(eq(aiAgents.isActive, true));
  }

  async getAiAgent(id: number): Promise<AiAgent | undefined> {
    const [agent] = await db.select().from(aiAgents).where(eq(aiAgents.id, id));
    return agent;
  }

  async createAiAgent(agent: InsertAiAgent): Promise<AiAgent> {
    const [newAgent] = await db.insert(aiAgents).values(agent).returning();
    return newAgent;
  }

  async updateAiAgent(id: number, agent: Partial<InsertAiAgent>): Promise<AiAgent> {
    const [updatedAgent] = await db
      .update(aiAgents)
      .set({ ...agent, updatedAt: new Date() })
      .where(eq(aiAgents.id, id))
      .returning();
    return updatedAgent;
  }

  // AI Conversations
  async getConversation(userId: string, agentId: number): Promise<AiConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(and(eq(aiConversations.userId, userId), eq(aiConversations.agentId, agentId)))
      .orderBy(desc(aiConversations.updatedAt));
    return conversation;
  }

  async createOrUpdateConversation(userId: string, agentId: number, messages: any[]): Promise<AiConversation> {
    const existing = await this.getConversation(userId, agentId);
    
    if (existing) {
      const [updated] = await db
        .update(aiConversations)
        .set({
          messages,
          updatedAt: new Date(),
        })
        .where(eq(aiConversations.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newConversation] = await db
        .insert(aiConversations)
        .values({
          userId,
          agentId,
          messages,
        })
        .returning();
      return newConversation;
    }
  }

  // Events
  async getUpcomingEvents(userId: string): Promise<Event[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    return await db
      .select()
      .from(events)
      .where(
        and(
          sql`${events.scheduledAt} > NOW()`,
          or(
            eq(events.requiredRole, "buyer"),
            eq(events.requiredRole, user.role)
          )
        )
      )
      .orderBy(events.scheduledAt);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async registerForEvent(eventId: number, userId: string): Promise<EventAttendee> {
    const [registration] = await db
      .insert(eventAttendees)
      .values({
        eventId,
        userId,
        status: "registered",
      })
      .returning();
    return registration;
  }

  // Workflows
  async getActiveWorkflows(): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.isActive, true));
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Blog operations
  async getBlogPosts(publishedOnly = false): Promise<(BlogPost & { author: User })[]> {
    const query = db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        summary: blogPosts.summary,
        content: blogPosts.content,
        tags: blogPosts.tags,
        status: blogPosts.status,
        authorId: blogPosts.authorId,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
        },
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .orderBy(desc(blogPosts.createdAt));

    if (publishedOnly) {
      query.where(eq(blogPosts.status, "published"));
    }

    return query;
  }

  async getBlogPost(id: number): Promise<(BlogPost & { author: User }) | undefined> {
    const [post] = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        summary: blogPosts.summary,
        content: blogPosts.content,
        tags: blogPosts.tags,
        status: blogPosts.status,
        authorId: blogPosts.authorId,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
        },
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.id, id));

    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<(BlogPost & { author: User }) | undefined> {
    const [post] = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        summary: blogPosts.summary,
        content: blogPosts.content,
        tags: blogPosts.tags,
        status: blogPosts.status,
        authorId: blogPosts.authorId,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
        },
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.slug, slug));

    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // LMS operations
  async getLmsModules(): Promise<LmsModule[]> {
    return await db.select().from(lmsModules).where(eq(lmsModules.isActive, true)).orderBy(lmsModules.order);
  }

  async getLmsModulesWithAccess(userId: string): Promise<(LmsModule & { isAccessible: boolean; unlockDate?: Date })[]> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const modules = await this.getLmsModules();
    
    return modules.map(module => {
      let isAccessible = false;
      let unlockDate: Date | undefined;

      if (user.role === "mastermind") {
        // Mastermind users have full access to all modules
        isAccessible = true;
      } else if (user.role === "buyer") {
        // Buyer users unlock 1 module every 30 days after purchase
        if (user.stripePaidAt) {
          const daysSincePurchase = Math.floor(
            (Date.now() - user.stripePaidAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysSincePurchase >= (module.unlockAfterDays || 0)) {
            isAccessible = true;
          } else {
            unlockDate = new Date(user.stripePaidAt.getTime() + ((module.unlockAfterDays || 0) * 24 * 60 * 60 * 1000));
          }
        }
      }
      // Guest users have no access to LMS modules

      return {
        ...module,
        isAccessible,
        unlockDate
      };
    });
  }

  async getLmsModule(id: number): Promise<LmsModule | undefined> {
    const [module] = await db.select().from(lmsModules).where(eq(lmsModules.id, id));
    return module;
  }

  async createLmsModule(moduleData: InsertLmsModule): Promise<LmsModule> {
    const [module] = await db.insert(lmsModules).values(moduleData).returning();
    return module;
  }

  async updateLmsModule(id: number, moduleData: Partial<InsertLmsModule>): Promise<LmsModule> {
    const [module] = await db
      .update(lmsModules)
      .set({
        ...moduleData,
        updatedAt: new Date(),
      })
      .where(eq(lmsModules.id, id))
      .returning();
    return module;
  }

  async getUserLmsProgress(userId: string): Promise<LmsProgress[]> {
    return await db.select().from(lmsProgress).where(eq(lmsProgress.userId, userId));
  }

  async updateUserLmsProgress(userId: string, moduleId: number, completed: boolean): Promise<LmsProgress> {
    // Check if progress record exists
    const [existingProgress] = await db
      .select()
      .from(lmsProgress)
      .where(and(eq(lmsProgress.userId, userId), eq(lmsProgress.moduleId, moduleId)));

    if (existingProgress) {
      // Update existing progress
      const [updated] = await db
        .update(lmsProgress)
        .set({
          completed,
          completedAt: completed ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(and(eq(lmsProgress.userId, userId), eq(lmsProgress.moduleId, moduleId)))
        .returning();
      return updated;
    } else {
      // Create new progress record
      const [created] = await db
        .insert(lmsProgress)
        .values({
          userId,
          moduleId,
          completed,
          completedAt: completed ? new Date() : null,
        })
        .returning();
      return created;
    }
  }

  async updateUserAccessTier(userId: string, accessTier: string): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ 
        accessTier,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ 
        role,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalPosts: number;
    activeEvents: number;
    totalBlogPosts: number;
  }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const [postCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
    const [eventCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(sql`${events.scheduledAt} > NOW()`);
    const [blogPostCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);

    return {
      totalUsers: userCount.count,
      totalCourses: courseCount.count,
      totalPosts: postCount.count,
      activeEvents: eventCount.count,
      totalBlogPosts: blogPostCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
