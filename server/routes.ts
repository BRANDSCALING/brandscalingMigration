import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { verifyFirebaseToken, requireAuth, requireRole, createUserProfile, getUserProfile, updateUserRole } from "./firebaseAuth";
import { chatWithAgent } from "./openai";
import { updateUserAfterPurchase } from "./updateUserAfterPurchase";
import { acClient } from "@shared/acClient";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route (public)
  app.get("/api/health", async (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Public blog posts endpoint (must be before auth middleware)
  app.get("/api/blog-posts/published", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(true); // Only published posts
      res.json(posts);
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Apply Firebase auth middleware to all other API routes
  app.use('/api', verifyFirebaseToken);

  // Firebase Auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { uid, email, displayName, role = 'guest' } = req.body;
      await createUserProfile(uid, email, displayName, role);
      res.json({ success: true, message: 'User profile created' });
    } catch (error) {
      console.error("Error creating user profile:", error);
      res.status(500).json({ message: "Failed to create user profile" });
    }
  });

  app.get('/api/auth/user', requireAuth, async (req, res) => {
    try {
      const userProfile = await getUserProfile(req.user!.uid);
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put('/api/auth/user/role', requireRole(['admin']), async (req, res) => {
    try {
      const { uid, role } = req.body;
      const success = await updateUserRole(uid, role);
      if (success) {
        res.json({ success: true, message: 'User role updated' });
      } else {
        res.status(500).json({ message: "Failed to update user role" });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', requireRole(['admin']), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.patch('/api/admin/users/:userId/role', requireRole(['admin']), async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      if (!['admin', 'student'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      
      const updatedUser = await storage.updateUserRole(userId, role);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Failed to update user role' });
    }
  });

  app.patch('/api/admin/users/:userId/tier', requireRole(['admin']), async (req, res) => {
    try {
      const { userId } = req.params;
      const { accessTier } = req.body;
      
      if (!['beginner', 'intermediate', 'advanced', 'mastermind'].includes(accessTier)) {
        return res.status(400).json({ message: 'Invalid access tier' });
      }
      
      const updatedUser = await storage.updateUserAccessTier(userId, accessTier);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user access tier:', error);
      res.status(500).json({ message: 'Failed to update user access tier' });
    }
  });

  app.get('/api/admin/courses', requireRole(['admin']), async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  app.post('/api/admin/courses', requireRole(['admin']), async (req, res) => {
    try {
      const course = await storage.createCourse(req.body);
      res.json(course);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  });

  app.get('/api/admin/ai-agents', requireRole(['admin']), async (req, res) => {
    try {
      const agents = await storage.getAiAgents();
      res.json(agents);
    } catch (error) {
      console.error('Error fetching AI agents:', error);
      res.status(500).json({ message: 'Failed to fetch AI agents' });
    }
  });

  app.patch('/api/admin/ai-agents/:id', requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updatedAgent = await storage.updateAiAgent(parseInt(id), req.body);
      res.json(updatedAgent);
    } catch (error) {
      console.error('Error updating AI agent:', error);
      res.status(500).json({ message: 'Failed to update AI agent' });
    }
  });

  app.get('/api/admin/stats', requireRole(['admin']), async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  // Course routes
  app.get("/api/courses", requireAuth, async (req, res) => {
    try {
      const track = req.query.track as string;
      const courses = await storage.getCourses(track);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.get("/api/user/progress", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : undefined;
      const progress = await storage.getUserProgress(userId, courseId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  app.post("/api/user/progress", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const { courseId, progress, currentModule } = req.body;
      
      const progressSchema = z.object({
        courseId: z.number(),
        progress: z.number().min(0).max(1),
        currentModule: z.number().optional(),
      });

      const validatedData = progressSchema.parse({ courseId, progress, currentModule });
      
      const updatedProgress = await storage.updateUserProgress(
        userId,
        validatedData.courseId,
        validatedData.progress,
        validatedData.currentModule
      );
      
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating user progress:", error);
      res.status(500).json({ message: "Failed to update user progress" });
    }
  });

  // Community Hub routes - STUDENT, ADMIN, STAFF ROLES
  app.get("/api/community/posts", requireRole(['student', 'admin', 'staff']), async (req, res) => {
    try {
      const tag = req.query.tag as string | undefined;
      const posts = await storage.getCommunityPosts(tag);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.post("/api/community/posts", requireRole(['student', 'admin', 'staff']), async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const { title, body, tags, uploadUrls } = req.body;

      const postSchema = z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        tags: z.array(z.string()).optional(),
        uploadUrls: z.array(z.string()).optional(),
      });

      const validatedData = postSchema.parse({ title, body, tags, uploadUrls });
      
      const post = await storage.createCommunityPost({
        userId,
        title: validatedData.title,
        body: validatedData.body,
        tags: validatedData.tags,
        uploadUrls: validatedData.uploadUrls,
      });
      
      res.json(post);
    } catch (error) {
      console.error("Error creating community post:", error);
      res.status(500).json({ message: "Failed to create community post" });
    }
  });

  app.put("/api/community/posts/:id", requireRole(['student']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.uid;
      const { title, body, tags, uploadUrls } = req.body;

      const postSchema = z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        tags: z.array(z.string()).optional(),
        uploadUrls: z.array(z.string()).optional(),
      });

      const validatedData = postSchema.parse({ title, body, tags, uploadUrls });
      
      const post = await storage.updateCommunityPost(postId, userId, validatedData);
      if (!post) {
        return res.status(404).json({ message: "Post not found or not authorized" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error updating community post:", error);
      res.status(500).json({ message: "Failed to update community post" });
    }
  });

  app.delete("/api/community/posts/:id", requireRole(['student']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.uid;
      
      const success = await storage.deleteCommunityPost(postId, userId);
      if (!success) {
        return res.status(404).json({ message: "Post not found or not authorized" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting community post:", error);
      res.status(500).json({ message: "Failed to delete community post" });
    }
  });

  app.post("/api/community/posts/:id/replies", requireRole(['student']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.uid;
      const { body } = req.body;

      const replySchema = z.object({
        body: z.string().min(1),
      });

      const validatedData = replySchema.parse({ body });
      
      const reply = await storage.createPostReply({
        postId,
        userId,
        body: validatedData.body,
      });
      
      res.json(reply);
    } catch (error) {
      console.error("Error creating post reply:", error);
      res.status(500).json({ message: "Failed to create post reply" });
    }
  });

  app.get("/api/community/posts/:id/replies", requireRole(['student']), async (req, res) => {
    try {
      const postId = req.params.id;
      const replies = await storage.getPostReplies(postId);
      res.json(replies);
    } catch (error) {
      console.error("Error fetching post replies:", error);
      res.status(500).json({ message: "Failed to fetch post replies" });
    }
  });

  app.post("/api/community/upload", requireRole(['student']), async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const { url, postId } = req.body;

      const uploadSchema = z.object({
        url: z.string().url(),
        postId: z.string().optional(),
      });

      const validatedData = uploadSchema.parse({ url, postId });
      
      const upload = await storage.createUpload({
        userId,
        url: validatedData.url,
        postId: validatedData.postId,
      });
      
      res.json(upload);
    } catch (error) {
      console.error("Error creating upload:", error);
      res.status(500).json({ message: "Failed to create upload" });
    }
  });

  app.post("/api/community/posts/:id/activity", requireRole(['student']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.uid;
      const { action } = req.body;

      const activitySchema = z.object({
        action: z.enum(['view', 'like', 'comment']),
      });

      const validatedData = activitySchema.parse({ action });
      
      const activity = await storage.createPostActivity({
        postId,
        userId,
        action: validatedData.action,
      });
      
      res.json(activity);
    } catch (error) {
      console.error("Error creating post activity:", error);
      res.status(500).json({ message: "Failed to create post activity" });
    }
  });

  // Admin delete any post permanently
  app.delete("/api/community/posts/:id/admin-delete", requireRole(['admin', 'staff']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const adminUserId = req.user.uid;
      const { reason } = req.body;
      
      await storage.adminDeletePost(postId, adminUserId, reason);
      res.json({ success: true });
    } catch (error) {
      console.error("Error admin deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Pin post
  app.post("/api/community/posts/:id/pin", requireRole(['admin', 'staff']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const adminId = req.user.uid;
      
      await storage.pinPost(postId, adminId);
      res.json({ message: "Post pinned successfully" });
    } catch (error: any) {
      console.error("Error pinning post:", error);
      res.status(500).json({ message: "Failed to pin post" });
    }
  });

  // Unpin post
  app.delete("/api/community/posts/:id/pin", requireRole(['admin', 'staff']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const adminId = req.user.uid;
      
      await storage.unpinPost(postId, adminId);
      res.json({ message: "Post unpinned successfully" });
    } catch (error: any) {
      console.error("Error unpinning post:", error);
      res.status(500).json({ message: "Failed to unpin post" });
    }
  });

  // Set featured
  app.post("/api/community/posts/:id/featured", requireRole(['admin', 'staff']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const adminId = req.user.uid;
      const { featuredType } = req.body;

      const featuredSchema = z.object({
        featuredType: z.enum(['launch', 'update', 'tip', 'warning', 'direction']),
      });

      const validatedData = featuredSchema.parse({ featuredType });
      
      await storage.setFeatured(postId, adminId, validatedData.featuredType);
      res.json({ message: "Post featured successfully" });
    } catch (error: any) {
      console.error("Error featuring post:", error);
      res.status(500).json({ message: "Failed to feature post" });
    }
  });

  // Remove featured
  app.delete("/api/community/posts/:id/featured", requireRole(['admin', 'staff']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const adminId = req.user.uid;
      
      await storage.removeFeatured(postId, adminId);
      res.json({ message: "Post unfeatured successfully" });
    } catch (error: any) {
      console.error("Error unfeaturing post:", error);
      res.status(500).json({ message: "Failed to unfeature post" });
    }
  });

  // Undo post within 60 seconds
  app.delete("/api/community/posts/:id/undo", requireRole(['student', 'admin', 'staff']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.uid;
      
      const undonePost = await storage.undoPost(postId, userId);
      res.json(undonePost);
    } catch (error: any) {
      console.error("Error undoing post:", error);
      if (error.message === 'Post not found or user not authorized') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to undo post" });
      }
    }
  });

  // Edit post
  app.put("/api/community/posts/:id", requireRole(['student']), async (req: any, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.uid;
      const { title, body, tags } = req.body;

      const updateSchema = z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        tags: z.array(z.string()).optional(),
      });

      const validatedData = updateSchema.parse({ title, body, tags });
      
      const updatedPost = await storage.updatePost(postId, userId, validatedData);
      res.json(updatedPost);
    } catch (error: any) {
      console.error("Error updating post:", error);
      if (error.message === 'Post not found or user not authorized') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update post" });
      }
    }
  });

  // Get post history
  app.get("/api/community/posts/:id/history", requireRole(['student']), async (req, res) => {
    try {
      const postId = req.params.id;
      
      const history = await storage.getPostHistory(postId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching post history:", error);
      res.status(500).json({ message: "Failed to fetch post history" });
    }
  });

  app.post("/api/posts/:id/reply", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const postId = parseInt(req.params.id);
      const { content } = req.body;

      const replySchema = z.object({
        content: z.string().min(1),
      });

      const validatedData = replySchema.parse({ content });
      
      const reply = await storage.createPostReply(postId, userId, validatedData.content);
      res.json(reply);
    } catch (error) {
      console.error("Error creating reply:", error);
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  app.post("/api/posts/:id/like", requireAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      await storage.likePost(postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // Quiz routes
  app.get("/api/quizzes", requireAuth, async (req, res) => {
    try {
      const quizzes = await storage.getQuizzes();
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.get("/api/quizzes/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quiz = await storage.getQuiz(id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  app.post("/api/quizzes/:id/submit", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const quizId = parseInt(req.params.id);
      const { answers, score } = req.body;

      const submissionSchema = z.object({
        answers: z.any(),
        score: z.number().min(0).max(1),
      });

      const validatedData = submissionSchema.parse({ answers, score });
      
      const result = await storage.saveQuizResult(
        userId,
        quizId,
        validatedData.answers,
        validatedData.score
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  app.get("/api/user/quiz-results", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const quizId = req.query.quizId ? parseInt(req.query.quizId as string) : undefined;
      const results = await storage.getUserQuizResults(userId, quizId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  // AI Agent routes
  app.get("/api/ai-agents", requireAuth, async (req, res) => {
    try {
      const agents = await storage.getAiAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching AI agents:", error);
      res.status(500).json({ message: "Failed to fetch AI agents" });
    }
  });

  app.post("/api/ai-agents/:id/chat", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const agentId = parseInt(req.params.id);
      const { message } = req.body;

      const chatSchema = z.object({
        message: z.string().min(1),
      });

      const validatedData = chatSchema.parse({ message });
      
      const agent = await storage.getAiAgent(agentId);
      if (!agent) {
        return res.status(404).json({ message: "AI agent not found" });
      }

      // Get existing conversation
      const conversation = await storage.getConversation(userId, agentId);
      const messages = conversation?.messages || [];

      // Add user message
      messages.push({ role: "user", content: validatedData.message });

      // Get AI response
      const aiResponse = await chatWithAgent(agent, messages);
      
      // Add AI response to messages
      messages.push({ role: "assistant", content: aiResponse });

      // Save conversation
      await storage.createOrUpdateConversation(userId, agentId, messages);

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error chatting with AI agent:", error);
      res.status(500).json({ message: "Failed to chat with AI agent" });
    }
  });

  // Events routes
  app.get("/api/events", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const events = await storage.getUpcomingEvents(userId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events/:id/register", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const eventId = parseInt(req.params.id);
      
      const registration = await storage.registerForEvent(eventId, userId);
      res.json(registration);
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).json({ message: "Failed to register for event" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAuth, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || "buyer";
      if (userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users/:id/role", requireAuth, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || "buyer";
      if (userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const userId = req.params.id;
      const { role } = req.body;

      const roleSchema = z.object({
        role: z.enum(["buyer", "mastermind", "admin"]),
      });

      const validatedData = roleSchema.parse({ role });
      
      const user = await storage.updateUserRole(userId, validatedData.role);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.get("/api/admin/stats", requireAuth, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || "buyer";
      if (userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching system stats:", error);
      res.status(500).json({ message: "Failed to fetch system stats" });
    }
  });

  // Analytics endpoints for Insights dashboard
  app.get("/api/admin/analytics/total-users", requireRole(['admin']), async (req: any, res) => {
    try {
      const analytics = await storage.getTotalUsersAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching total users:", error);
      res.status(500).json({ message: "Failed to fetch total users analytics" });
    }
  });

  app.get("/api/admin/analytics/new-posts", requireRole(['admin']), async (req: any, res) => {
    try {
      const analytics = await storage.getNewPostsAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching new posts analytics:", error);
      res.status(500).json({ message: "Failed to fetch new posts analytics" });
    }
  });

  app.get("/api/admin/analytics/user-growth", requireRole(['admin']), async (req: any, res) => {
    try {
      const analytics = await storage.getUserGrowthAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching user growth analytics:", error);
      res.status(500).json({ message: "Failed to fetch user growth analytics" });
    }
  });

  app.get("/api/admin/analytics/moderation", requireRole(['admin']), async (req: any, res) => {
    try {
      const analytics = await storage.getModerationAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching moderation analytics:", error);
      res.status(500).json({ message: "Failed to fetch moderation analytics" });
    }
  });

  app.get("/api/admin/analytics/banned-users", requireRole(['admin']), async (req: any, res) => {
    try {
      const analytics = await storage.getBannedUsersAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching banned users analytics:", error);
      res.status(500).json({ message: "Failed to fetch banned users analytics" });
    }
  });

  app.post("/api/admin/courses", requireAuth, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || "buyer";
      if (userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const courseData = req.body;
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Blog management routes (admin only)
  app.get("/api/blog-posts", requireRole(['admin']), async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(false); // Get all posts including drafts
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/blog-posts", requireRole(['admin']), async (req: any, res) => {
    try {
      const { title, summary, content, tags, status = 'draft' } = req.body;
      
      // Auto-generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const blogPostData = {
        title,
        slug,
        summary,
        content,
        tags,
        status,
        authorId: req.user.uid,
      };

      const blogPostSchema = z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        summary: z.string().optional(),
        content: z.string().optional(),
        tags: z.string().optional(),
        status: z.enum(['draft', 'published']),
        authorId: z.string(),
      });

      const validatedData = blogPostSchema.parse(blogPostData);
      const post = await storage.createBlogPost(validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/blog-posts/:id", requireRole(['admin']), async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, summary, content, tags, status } = req.body;
      
      let updateData: any = { summary, content, tags, status };
      
      // If title changed, regenerate slug
      if (title) {
        updateData.title = title;
        updateData.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      const post = await storage.updateBlogPost(id, updateData);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // AI Blog generation endpoint
  app.post("/api/ai/generate-blog", requireRole(['admin']), async (req, res) => {
    try {
      const { topic, transcript } = req.body;

      if (!topic && !transcript) {
        return res.status(400).json({ message: "Topic or transcript is required" });
      }

      // Generate structured blog content using OpenAI
      const blogContent = {
        title: "AI-Generated Blog Post",
        summary: "This blog post was generated using artificial intelligence based on your input.",
        content: "AI blog generation requires OpenAI API configuration. Please provide your OpenAI API key to enable this feature.",
        tags: "ai, generated",
        status: "draft" as const
      };

      res.json(blogContent);
    } catch (error) {
      console.error("Error generating blog post:", error);
      res.status(500).json({ message: "Failed to generate blog post" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", requireAuth, async (req: any, res) => {
    try {
      const { amount, courseId, currency = "usd" } = req.body;
      
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Stripe secret key not configured');
      }

      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to pence for GBP
        currency: currency || "gbp",
        metadata: {
          courseId: courseId || '',
          userId: req.user.uid,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/create-subscription", requireAuth, async (req: any, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Stripe secret key not configured');
      }

      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const userId = req.user.uid;
      const userProfile = await storage.getUser(userId);
      
      if (!userProfile || !userProfile.email) {
        return res.status(400).json({ message: "User profile or email not found" });
      }

      // Check if user already has a subscription
      if (userProfile.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(userProfile.stripeSubscriptionId);
        if (subscription.status === 'active') {
          return res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
          });
        }
      }

      // Create or get customer
      let customerId = userProfile.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: userProfile.email,
          name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
          metadata: {
            userId: userId,
          },
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId);
      }

      // Create subscription with GBP pricing
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Brandscaling Platform Access',
              description: 'Monthly access to all Brandscaling courses and resources',
            },
            unit_amount: 9700, // £97.00 in pence
            recurring: {
              interval: 'month',
            },
          },
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription info
      await storage.updateUserStripeInfo(userId, customerId, subscription.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  // Taster Day checkout session
  app.post("/api/checkout/taster-day", async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Stripe secret key not configured');
      }

      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "gbp",
              unit_amount: 29700, // £297 in pence
              product_data: {
                name: "Taster Day Ticket",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${req.protocol}://${req.get('host')}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancelled`,
        metadata: {
          product: "taster-day",
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating taster day checkout session:", error);
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Mastermind checkout session
  app.post("/api/checkout/mastermind", async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Stripe secret key not configured');
      }

      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "gbp",
              unit_amount: 2400000, // £24,000 in pence
              product_data: {
                name: "Mastermind Access",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${req.protocol}://${req.get('host')}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancelled`,
        metadata: {
          product: "mastermind",
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating mastermind checkout session:", error);
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Stripe webhook endpoint - raw body parsing for signature verification
  app.post("/api/stripe/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('Stripe keys not configured');
      }

      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
      
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        // Verify webhook signature using raw body
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        
        const email = session.customer_details?.email;
        const product = session.metadata?.product;
        const stripeId = session.id;

        if (email && product) {
          try {
            // Update user access based on product purchased
            await updateUserAfterPurchase(email, product, stripeId);
          } catch (updateError: any) {
            console.error('Error updating user after purchase:', updateError);
          }
        }
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: "Webhook error: " + error.message });
    }
  });

  // LMS API endpoints with role-based access control
  app.get("/api/lms/modules", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Implement role-based access control
      if (user.role === "guest") {
        return res.status(401).json({ message: "Login required to access LMS modules" });
      }
      
      const modulesWithAccess = await storage.getLmsModulesWithAccess(userId);
      const progress = await storage.getUserLmsProgress(userId);
      
      // Transform modules with access control information
      const transformedModules = modulesWithAccess.map(module => ({
        id: module.id,
        title: module.title,
        slug: module.slug,
        description: module.description,
        order: module.order,
        requiredRole: module.requiredRole,
        isAccessible: module.isAccessible,
        unlockDate: module.unlockDate?.toISOString(),
        unlockAfterDays: module.unlockAfterDays,
        isLocked: module.isLocked,
        completed: progress.some(p => p.moduleId === module.id && p.completed),
        architectContent: {
          videoUrl: module.architectVideoUrl,
          workbookUrl: module.architectWorkbookUrl,
          summary: module.architectSummary,
        },
        alchemistContent: {
          videoUrl: module.alchemistVideoUrl,
          workbookUrl: module.alchemistWorkbookUrl,
          summary: module.alchemistSummary,
        },
      }));
      
      res.json(transformedModules);
    } catch (error: any) {
      console.error("Error fetching LMS modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get("/api/lms/progress", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserLmsProgress(userId);
      
      // Transform progress to match frontend interface
      const transformedProgress = progress.map(p => ({
        moduleId: p.moduleId,
        completed: p.completed,
        completedAt: p.completedAt?.toISOString(),
      }));
      
      res.json(transformedProgress);
    } catch (error: any) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/lms/progress", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { moduleId } = req.body;
      
      if (!moduleId) {
        return res.status(400).json({ message: "Module ID is required" });
      }
      
      const progress = await storage.updateUserLmsProgress(userId, moduleId, true);
      res.json(progress);
    } catch (error: any) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // AI Assistant endpoint for LMS
  app.post("/api/lms/ai-assistant", requireAuth, async (req: any, res) => {
    try {
      const { moduleId, moduleTitle, userMode, message, conversationHistory } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get AI agent prompts for personalized responses
      const agents = await storage.getAiAgents();
      let systemPrompt = agents.find(agent => agent.name === 'lms_assistant')?.systemPrompt || '';
      
      // Default system prompt if none configured
      if (!systemPrompt) {
        systemPrompt = `You are an expert ${userMode === 'architect' ? 'Architect' : 'Alchemist'} AI assistant for the Brandscaling Platform. You're helping users with "${moduleTitle}".

${userMode === 'architect' ? 
  'As an Architect assistant, you focus on structured, systematic approaches. Provide step-by-step guidance, frameworks, and logical implementation strategies. Be precise, organized, and methodical in your responses.' : 
  'As an Alchemist assistant, you focus on creative, intuitive approaches. Provide inspiring insights, emotional connections, and innovative strategies. Be creative, empathetic, and visionary in your responses.'
}

Keep responses helpful, concise, and actionable. Always relate advice back to the current module content.`;
      }

      const response = await chatWithAgent(
        { systemPrompt, name: 'lms_assistant' },
        message
      );

      res.json({ response });
    } catch (error: any) {
      console.error("Error with AI assistant:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // Deep Assessment endpoint
  app.post("/api/quiz/deep-assessment", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const { answers, architectScore, alchemistScore, readinessScore, dominantType, readinessLevel, tags, completedAt } = req.body;
      
      // Update user profile with assessment results
      await storage.updateUserAssessment(userId, {
        architectScore,
        alchemistScore,
        readinessScore,
        dominantType,
        readinessLevel,
        tags: tags.join(','),
        assessmentComplete: true
      });

      // Store detailed quiz results
      await storage.saveQuizResult(userId, 999, answers, readinessScore, {
        architectScore,
        alchemistScore,
        readinessScore,
        dominantType,
        readinessLevel,
        tags
      });

      res.json({
        success: true,
        profile: {
          architectScore,
          alchemistScore,
          readinessScore,
          dominantType,
          readinessLevel,
          tags
        }
      });
    } catch (error: any) {
      console.error("Error saving deep assessment:", error);
      res.status(500).json({ message: "Failed to save assessment results" });
    }
  });

  app.post("/api/admin/ai-agents", requireAuth, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || "buyer";
      if (userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const agentData = req.body;
      const agent = await storage.createAiAgent(agentData);
      res.json(agent);
    } catch (error) {
      console.error("Error creating AI agent:", error);
      res.status(500).json({ message: "Failed to create AI agent" });
    }
  });

  // ActiveCampaign integration
  app.post("/api/ac/add-contact", requireAuth, async (req: any, res) => {
    try {
      const { email, firstName, lastName } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Create or update contact in ActiveCampaign
      const contactPayload = {
        contact: {
          email,
          firstName: firstName || '',
          lastName: lastName || ''
        }
      };

      const response = await acClient.post('/api/3/contacts', contactPayload);

      if (response.status === 201) {
        // Contact created successfully
        res.json({ 
          success: true, 
          contactId: response.data.contact.id,
          message: 'Contact created successfully'
        });
      } else if (response.status === 200) {
        // Contact updated successfully
        res.json({ 
          success: true, 
          contactId: response.data.contact.id,
          message: 'Contact updated successfully'
        });
      }

    } catch (error: any) {
      if (error.response?.status === 409) {
        // Contact already exists, try to update instead
        try {
          const { email, firstName, lastName } = req.body;
          
          // First get the existing contact
          const searchResponse = await acClient.get(`/api/3/contacts?email=${encodeURIComponent(email)}`);
          
          if (searchResponse.data.contacts && searchResponse.data.contacts.length > 0) {
            const existingContact = searchResponse.data.contacts[0];
            
            // Update the existing contact
            const updatePayload = {
              contact: {
                email,
                firstName: firstName || existingContact.firstName || '',
                lastName: lastName || existingContact.lastName || ''
              }
            };
            
            const updateResponse = await acClient.put(`/api/3/contacts/${existingContact.id}`, updatePayload);
            
            res.json({ 
              success: true, 
              contactId: existingContact.id,
              message: 'Contact updated successfully'
            });
          } else {
            res.status(500).json({ error: 'Contact conflict but unable to find existing contact' });
          }
        } catch (updateError: any) {
          res.status(500).json({ 
            error: 'Failed to update existing contact',
            details: updateError.response?.data || updateError.message 
          });
        }
      } else {
        res.status(500).json({ 
          error: 'Failed to create/update contact',
          details: error.response?.data || error.message 
        });
      }
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Broadcast to all connected clients (for community chat)
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
    });
  });



  return httpServer;
}
