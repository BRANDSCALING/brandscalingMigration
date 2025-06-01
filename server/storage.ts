import { db } from "./db";
import { eq, desc, asc, count, and, or, sql, isNull } from "drizzle-orm";
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
  courses,
  userProgress,
  type User,
  type Post,
  type PostReply,
  type LmsModule,
  type LmsProgress,
  type QuizResult,
  type Event,
  type BlogPost,
  type AiAgent
} from "@shared/schema";

// Simple ID generator
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

type CommunityPost = Post & { user: User };

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: Partial<User>): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User>;
  upsertUser(userData: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, newRole: string): Promise<User>;
  updateUserAccessTier(userId: string, newTier: string): Promise<User>;
  updateUserStripeInfo(userId: string, stripeData: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User>;
  updateUserAssessment(userId: string, assessmentData: any): Promise<User>;
  
  // Course operations
  getCourses(): Promise<any[]>;
  getCourse(id: number): Promise<any | undefined>;
  createCourse(courseData: any): Promise<any>;
  updateCourse(id: number, courseData: any): Promise<any>;
  deleteCourse(id: number): Promise<void>;
  
  // User Progress operations
  getUserProgress(userId: string): Promise<any[]>;
  updateUserProgress(userId: string, courseId: number, progressData: any): Promise<any>;
  getUserLmsProgress(userId: string): Promise<LmsProgress[]>;
  updateUserLmsProgress(userId: string, moduleId: number, progressData: any): Promise<void>;
  getLmsModulesWithAccess(userId: string): Promise<any[]>;
  
  // Community operations
  getAllPosts(): Promise<CommunityPost[]>;
  getPost(id: string): Promise<CommunityPost | undefined>;
  createPost(postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost>;
  updatePost(id: string, userId: string, updateData: { title: string; body: string; tags?: string[] }): Promise<CommunityPost>;
  deletePost(id: string, userId: string): Promise<void>;
  undoPost(id: string, userId: string): Promise<CommunityPost>;
  adminDeletePost(id: string, adminId: string): Promise<void>;
  getCommunityPosts(): Promise<CommunityPost[]>;
  createCommunityPost(postData: any): Promise<CommunityPost>;
  updateCommunityPost(id: string, userId: string, updateData: any): Promise<CommunityPost>;
  deleteCommunityPost(id: string, userId: string): Promise<void>;
  getPostHistory(postId: string): Promise<any[]>;
  likePost(postId: string, userId: string): Promise<void>;
  
  // Moderation operations
  pinPost(id: string, adminId: string): Promise<void>;
  unpinPost(id: string, adminId: string): Promise<void>;
  setFeatured(id: string, adminId: string, featuredType: string): Promise<void>;
  removeFeatured(id: string, adminId: string): Promise<void>;
  
  // Reply operations
  createReply(replyData: Omit<PostReply, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostReply>;
  getReplies(postId: string): Promise<PostReply[]>;
  createPostReply(replyData: any): Promise<PostReply>;
  getPostReplies(postId: string): Promise<PostReply[]>;
  
  // Upload operations
  createUpload(uploadData: any): Promise<any>;
  createPostActivity(activityData: any): Promise<any>;
  
  // LMS operations
  getLmsModules(): Promise<LmsModule[]>;
  getLmsProgress(userId: string): Promise<LmsProgress[]>;
  markModuleComplete(userId: string, moduleId: number): Promise<void>;
  
  // Quiz operations
  saveQuizResult(resultData: Omit<QuizResult, 'id' | 'createdAt'>): Promise<QuizResult>;
  getQuizResults(userId: string): Promise<QuizResult[]>;
  getQuizzes(): Promise<any[]>;
  getQuiz(id: number): Promise<any | undefined>;
  getUserQuizResults(userId: string): Promise<QuizResult[]>;
  
  // Event operations
  getEvents(): Promise<Event[]>;
  createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event>;
  getUpcomingEvents(): Promise<Event[]>;
  registerForEvent(eventId: number, userId: string): Promise<void>;
  
  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost>;
  updateBlogPost(id: number, updateData: any): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // AI Agent operations
  getAiAgents(): Promise<AiAgent[]>;
  getAiAgent(id: number): Promise<AiAgent | undefined>;
  createAiAgent(agentData: any): Promise<AiAgent>;
  updateAiAgent(id: number, agentData: any): Promise<AiAgent>;
  
  // Conversation operations
  getConversation(userId: string, agentId: number): Promise<any | undefined>;
  createOrUpdateConversation(conversationData: any): Promise<any>;
  
  // System operations
  getSystemStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const [user] = await db.insert(users).values({
      id: userData.id || generateId(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: userData.role || 'student',
      accessTier: userData.accessTier || 'free',
    }).returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllPosts(): Promise<CommunityPost[]> {
    const postsWithUsers = await db
      .select({
        id: posts.id,
        title: posts.title,
        body: posts.body,
        userId: posts.userId,
        tags: posts.tags,
        uploadUrls: posts.uploadUrls,
        isPinned: posts.isPinned,
        pinnedAt: posts.pinnedAt,
        pinnedBy: posts.pinnedBy,
        featuredType: posts.featuredType,
        featuredAt: posts.featuredAt,
        featuredBy: posts.featuredBy,
        isDeleted: posts.isDeleted,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.isDeleted, false))
      .orderBy(
        desc(posts.featuredAt),
        desc(posts.pinnedAt), 
        desc(posts.createdAt)
      );

    return postsWithUsers.map(post => ({
      ...post,
      tags: post.tags || [],
      uploadUrls: post.uploadUrls || [],
      user: post.user || {
        id: '',
        email: null,
        firstName: null,
        lastName: null,
        profileImageUrl: null,
        role: 'student',
        accessTier: 'beginner',
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripeId: null,
        stripePaidAt: null,
        architectScore: null,
        alchemistScore: null,
        readinessScore: null,
        dominantType: null,
        readinessLevel: null,
        tags: null,
        assessmentComplete: false,
        createdAt: null,
        updatedAt: null
      }
    }));
  }

  async getPost(id: string): Promise<CommunityPost | undefined> {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        body: posts.body,
        userId: posts.userId,
        tags: posts.tags,
        uploadUrls: posts.uploadUrls,
        isPinned: posts.isPinned,
        pinnedAt: posts.pinnedAt,
        pinnedBy: posts.pinnedBy,
        featuredType: posts.featuredType,
        featuredAt: posts.featuredAt,
        featuredBy: posts.featuredBy,
        isDeleted: posts.isDeleted,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(and(eq(posts.id, id), eq(posts.isDeleted, false)));

    if (!post) return undefined;

    return {
      ...post,
      tags: post.tags || [],
      uploadUrls: post.uploadUrls || [],
      user: post.user || {
        id: '',
        email: null,
        firstName: null,
        lastName: null,
        profileImageUrl: null,
        role: 'student',
        accessTier: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        firebaseUid: null,
        isEmailVerified: null,
        lastLoginAt: null,
        createdAt: null,
        updatedAt: null
      }
    };
  }

  async createPost(postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost> {
    const postId = generateId();
    const [newPost] = await db.insert(posts).values({
      id: postId,
      title: postData.title,
      body: postData.body,
      userId: postData.userId,
      tags: postData.tags,
      uploadUrls: postData.uploadUrls,
      isPinned: false,
      featuredType: null,
      isDeleted: false,
    }).returning();

    const fullPost = await this.getPost(postId);
    return fullPost!;
  }

  async updatePost(id: string, userId: string, updateData: { title: string; body: string; tags?: string[] }): Promise<CommunityPost> {
    const existingPost = await this.getPost(id);
    if (!existingPost || existingPost.userId !== userId) {
      throw new Error('Post not found or user not authorized');
    }

    const now = new Date();
    const timeDiff = now.getTime() - new Date(existingPost.createdAt!).getTime();
    const fiveMinutes = 5 * 60 * 1000;

    if (timeDiff > fiveMinutes) {
      throw new Error('Edit time limit exceeded');
    }

    await db
      .update(posts)
      .set({
        title: updateData.title,
        body: updateData.body,
        tags: updateData.tags,
        updatedAt: now,
      })
      .where(eq(posts.id, id));

    const updatedPost = await this.getPost(id);
    return updatedPost!;
  }

  async deletePost(id: string, userId: string): Promise<void> {
    const post = await this.getPost(id);
    if (!post || post.userId !== userId) {
      throw new Error('Post not found or user not authorized');
    }

    const now = new Date();
    const timeDiff = now.getTime() - new Date(post.createdAt!).getTime();
    const sixtySeconds = 60 * 1000;

    if (timeDiff > sixtySeconds) {
      throw new Error('Delete time limit exceeded');
    }

    await db
      .update(posts)
      .set({ isDeleted: true, updatedAt: now })
      .where(eq(posts.id, id));
  }

  async undoPost(id: string, userId: string): Promise<CommunityPost> {
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, userId), eq(posts.isDeleted, true)));

    if (!post) {
      throw new Error('Post not found or user not authorized');
    }

    const now = new Date();
    const timeDiff = now.getTime() - new Date(post.updatedAt!).getTime();
    const sixtySeconds = 60 * 1000;

    if (timeDiff > sixtySeconds) {
      throw new Error('Undo time limit exceeded');
    }

    await db
      .update(posts)
      .set({ isDeleted: false, updatedAt: now })
      .where(eq(posts.id, id));

    const restoredPost = await this.getPost(id);
    return restoredPost!;
  }

  async adminDeletePost(id: string, adminId: string): Promise<void> {
    await db
      .update(posts)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(posts.id, id));
  }

  async pinPost(id: string, adminId: string): Promise<void> {
    await db
      .update(posts)
      .set({
        isPinned: true,
        pinnedAt: new Date(),
        pinnedBy: adminId,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));
  }

  async unpinPost(id: string, adminId: string): Promise<void> {
    await db
      .update(posts)
      .set({
        isPinned: false,
        pinnedAt: null,
        pinnedBy: null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));
  }

  async setFeatured(id: string, adminId: string, featuredType: string): Promise<void> {
    await db
      .update(posts)
      .set({
        featuredType: featuredType,
        featuredAt: new Date(),
        featuredBy: adminId,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));
  }

  async removeFeatured(id: string, adminId: string): Promise<void> {
    await db
      .update(posts)
      .set({
        featuredType: null,
        featuredAt: null,
        featuredBy: null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));
  }

  async createReply(replyData: Omit<PostReply, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostReply> {
    const [reply] = await db.insert(postReplies).values({
      id: generateId(),
      body: replyData.body,
      userId: replyData.userId,
      postId: replyData.postId,
      isDeleted: false,
    }).returning();
    return reply;
  }

  async getReplies(postId: string): Promise<PostReply[]> {
    const replies = await db
      .select()
      .from(postReplies)
      .where(and(eq(postReplies.postId, postId), eq(postReplies.isDeleted, false)))
      .orderBy(asc(postReplies.createdAt));
    return replies;
  }

  async getLmsModules(): Promise<LmsModule[]> {
    const modules = await db
      .select()
      .from(lmsModules)
      .where(eq(lmsModules.isActive, true))
      .orderBy(asc(lmsModules.order));
    return modules;
  }

  async getLmsProgress(userId: string): Promise<LmsProgress[]> {
    const progress = await db
      .select()
      .from(lmsProgress)
      .where(eq(lmsProgress.userId, userId));
    return progress;
  }

  async markModuleComplete(userId: string, moduleId: number): Promise<void> {
    await db.insert(lmsProgress).values({
      userId,
      moduleId,
      completed: true,
      completedAt: new Date(),
    }).onConflictDoUpdate({
      target: [lmsProgress.userId, lmsProgress.moduleId],
      set: {
        completed: true,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async saveQuizResult(resultData: Omit<QuizResult, 'id' | 'createdAt'>): Promise<QuizResult> {
    const [result] = await db.insert(quizResults).values({
      userId: resultData.userId,
      quizId: 1, // Default quiz ID
      answers: resultData.answers || {},
      score: resultData.score,
      results: resultData.results || {},
    }).returning();
    return result;
  }

  async getQuizResults(userId: string): Promise<QuizResult[]> {
    const results = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId))
      .orderBy(desc(quizResults.createdAt));
    return results;
  }

  async getEvents(): Promise<Event[]> {
    const eventList = await db
      .select()
      .from(events)
      .orderBy(asc(events.createdAt));
    return eventList;
  }

  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    const posts = await db
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
        }
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.createdAt));
    return posts;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
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
        }
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(postData).returning();
    return post;
  }

  async getAiAgents(): Promise<AiAgent[]> {
    const agents = await db
      .select()
      .from(aiAgents)
      .where(eq(aiAgents.isActive, true));
    return agents;
  }

  async getAiAgent(id: number): Promise<AiAgent | undefined> {
    const [agent] = await db
      .select()
      .from(aiAgents)
      .where(eq(aiAgents.id, id));
    return agent;
  }

  // Additional User operations
  async upsertUser(userData: Partial<User>): Promise<User> {
    if (userData.id) {
      const existingUser = await this.getUser(userData.id);
      if (existingUser) {
        return this.updateUser(userData.id, userData);
      }
    }
    return this.createUser(userData);
  }

  async getAllUsers(): Promise<User[]> {
    const userList = await db.select().from(users).orderBy(desc(users.createdAt));
    return userList;
  }

  async updateUserRole(userId: string, newRole: string): Promise<User> {
    return this.updateUser(userId, { role: newRole });
  }

  async updateUserAccessTier(userId: string, newTier: string): Promise<User> {
    return this.updateUser(userId, { accessTier: newTier });
  }

  async updateUserStripeInfo(userId: string, stripeData: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User> {
    return this.updateUser(userId, stripeData);
  }

  async updateUserAssessment(userId: string, assessmentData: any): Promise<User> {
    return this.updateUser(userId, assessmentData);
  }

  // Course operations
  async getCourses(): Promise<any[]> {
    const courseList = await db.select().from(courses).orderBy(asc(courses.level));
    return courseList;
  }

  async getCourse(id: number): Promise<any | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(courseData: any): Promise<any> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async updateCourse(id: number, courseData: any): Promise<any> {
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

  // User Progress operations
  async getUserProgress(userId: string): Promise<any[]> {
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    return progress;
  }

  async updateUserProgress(userId: string, courseId: number, progressData: any): Promise<any> {
    const [progress] = await db.insert(userProgress).values({
      userId,
      courseId,
      ...progressData
    }).onConflictDoUpdate({
      target: [userProgress.userId, userProgress.courseId],
      set: { ...progressData, updatedAt: new Date() }
    }).returning();
    return progress;
  }

  async getUserLmsProgress(userId: string): Promise<LmsProgress[]> {
    return this.getLmsProgress(userId);
  }

  async updateUserLmsProgress(userId: string, moduleId: number, progressData: any): Promise<void> {
    await db.insert(lmsProgress).values({
      userId,
      moduleId,
      ...progressData
    }).onConflictDoUpdate({
      target: [lmsProgress.userId, lmsProgress.moduleId],
      set: { ...progressData, updatedAt: new Date() }
    });
  }

  async getLmsModulesWithAccess(userId: string): Promise<any[]> {
    const user = await this.getUser(userId);
    const modules = await this.getLmsModules();
    
    return modules.map(module => ({
      ...module,
      isAccessible: true // Based on user tier and module requirements
    }));
  }

  // Additional Community operations
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return this.getAllPosts();
  }

  async createCommunityPost(postData: any): Promise<CommunityPost> {
    return this.createPost(postData);
  }

  async updateCommunityPost(id: string, userId: string, updateData: any): Promise<CommunityPost> {
    return this.updatePost(id, userId, updateData);
  }

  async deleteCommunityPost(id: string, userId: string): Promise<void> {
    return this.deletePost(id, userId);
  }

  async getPostHistory(postId: string): Promise<any[]> {
    // Return empty array as post history isn't tracked in current schema
    return [];
  }

  async likePost(postId: string, userId: string): Promise<void> {
    // Post likes not implemented in current schema
    return;
  }

  // Additional Reply operations
  async createPostReply(replyData: any): Promise<PostReply> {
    return this.createReply(replyData);
  }

  async getPostReplies(postId: string): Promise<PostReply[]> {
    return this.getReplies(postId);
  }

  // Upload operations
  async createUpload(uploadData: any): Promise<any> {
    // File uploads not tracked in current schema
    return { id: generateId(), ...uploadData };
  }

  async createPostActivity(activityData: any): Promise<any> {
    // Post activity not tracked in current schema
    return { id: generateId(), ...activityData };
  }

  // Additional Quiz operations
  async getQuizzes(): Promise<any[]> {
    // Quiz table not defined in current schema, return empty array
    return [];
  }

  async getQuiz(id: number): Promise<any | undefined> {
    // Quiz table not defined in current schema
    return undefined;
  }

  async getUserQuizResults(userId: string): Promise<QuizResult[]> {
    return this.getQuizResults(userId);
  }

  // Additional Event operations
  async getUpcomingEvents(): Promise<Event[]> {
    const upcomingEvents = await db
      .select()
      .from(events)
      .where(sql`${events.scheduledAt} > NOW()`)
      .orderBy(asc(events.scheduledAt));
    return upcomingEvents;
  }

  async registerForEvent(eventId: number, userId: string): Promise<void> {
    // Event registration not implemented in current schema
    return;
  }

  // Additional Blog operations
  async updateBlogPost(id: number, updateData: any): Promise<BlogPost> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Additional AI Agent operations
  async createAiAgent(agentData: any): Promise<AiAgent> {
    const [agent] = await db.insert(aiAgents).values(agentData).returning();
    return agent;
  }

  async updateAiAgent(id: number, agentData: any): Promise<AiAgent> {
    const [agent] = await db
      .update(aiAgents)
      .set({ ...agentData, updatedAt: new Date() })
      .where(eq(aiAgents.id, id))
      .returning();
    return agent;
  }

  // Conversation operations
  async getConversation(userId: string, agentId: number): Promise<any | undefined> {
    // Conversations not fully implemented in current schema
    return undefined;
  }

  async createOrUpdateConversation(conversationData: any): Promise<any> {
    // Conversations not fully implemented in current schema
    return { id: generateId(), ...conversationData };
  }

  // System operations
  async getSystemStats(): Promise<any> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [postCount] = await db.select({ count: count() }).from(posts);
    const [courseCount] = await db.select({ count: count() }).from(courses);
    const [eventCount] = await db.select({ count: count() }).from(events);

    return {
      users: userCount.count,
      posts: postCount.count,
      courses: courseCount.count,
      events: eventCount.count
    };
  }
}

export const storage = new DatabaseStorage();