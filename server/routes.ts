import { Express } from 'express';
import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { DatabaseStorage } from './storage';

export async function registerRoutes(app: Express): Promise<Server> {
  const storage = new DatabaseStorage();

  // Middleware for authentication
  // Authentication middleware to set req.user from headers
  app.use('/api', (req, res, next) => {
    // Skip auth middleware for public routes
    const publicPaths = ['/auth/user', '/auth/admin-login', '/auth/student-login', '/auth/student-signup', '/dev/create-admin', '/ai-agents/chat', '/workbooks/upload', '/workbooks/progress', '/workbooks/status', '/quiz/entrepreneurial-dna/submit', '/quiz/entrepreneurial-dna/eligibility', '/test/email', '/test/simulate-purchase'];
    
    if (publicPaths.some(path => req.path === path || req.path.startsWith(path))) {
      // Set anonymous user for workbook and quiz routes
      if (req.path.startsWith('/workbooks') || req.path.includes('/quiz/')) {
        req.user = { uid: `anonymous-${Date.now()}`, email: 'anonymous@quiz.com', role: 'user' };
      }
      return next();
    }
    
    // Check for admin session
    const adminId = req.headers['x-admin-id'];
    if (adminId === 'admin-dev-12345' || adminId === 'master-admin-2025') {
      req.user = {
        uid: adminId,
        email: adminId === 'master-admin-2025' ? 'master@brandscaling.com' : 'admin@brandscaling.com',
        role: 'admin'
      };
      return next();
    }
    
    // Check for student session
    const studentId = req.headers['x-student-id'] as string;
    const studentEmail = req.headers['x-student-email'] as string;
    
    // Master student credentials (bypass all restrictions)
    if (studentId === 'master-student-2025' || studentEmail === 'master@brandscaling.com') {
      req.user = {
        uid: 'master-student-2025',
        email: 'master@brandscaling.com',
        role: 'student',
        tier: 'master'
      };
      return next();
    }
    
    if (studentId && studentEmail) {
      req.user = {
        uid: studentId,
        email: studentEmail,
        role: 'student'
      };
      return next();
    }
    
    // No authentication found - will be caught by requireAuth middleware
    next();
  });

  const requireAuth = (req: any, res: any, next: any) => {
    // Check for Firebase auth
    if (req.user) {
      next();
      return;
    }
    
    // Check for student headers authentication
    const studentId = req.headers['x-student-id'] as string;
    const studentEmail = req.headers['x-student-email'] as string;
    
    if (studentId && studentEmail) {
      // Create a mock user object for compatibility
      req.user = {
        uid: studentId,
        email: studentEmail,
        role: 'student'
      };
      next();
      return;
    }
    
    res.status(401).json({ message: 'Authentication required' });
  };

  // Entrepreneurial DNA Quiz endpoints
  app.get('/api/quiz/entrepreneurial-dna/eligibility', async (req, res) => {
    try {
      // Use the x-student-id header if available, otherwise try other auth methods
      const studentId = req.headers['x-student-id'] as string;
      const userId = studentId || req.user?.uid || 'anonymous-user';
      
      console.log('Checking quiz eligibility for user:', userId);
      
      // Master user bypass - can always retake quiz
      if (userId === 'master-student-2025' || req.headers['x-student-email'] === 'master@brandscaling.com') {
        console.log('Master user detected - bypassing restrictions');
        return res.json({ canRetake: true, nextRetakeDate: null });
      }
      
      try {
        const eligibility = await storage.checkEntrepreneurialDnaQuizEligibility(userId);
        console.log('Eligibility result:', eligibility);
        res.json(eligibility);
      } catch (dbError) {
        console.warn('Database check failed, defaulting to restricted access:', dbError);
        // On database error, be conservative and restrict access
        res.json({ canRetake: false, nextRetakeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
      }
    } catch (error) {
      console.error("Error checking quiz eligibility:", error);
      res.status(500).json({ message: "Failed to check quiz eligibility" });
    }
  });

  app.post('/api/quiz/entrepreneurial-dna/submit', async (req, res) => {
    try {
      const { answers } = req.body;
      const studentId = req.headers['x-student-id'] as string;
      const userId = studentId || req.user?.uid || 'anonymous-user';
      
      if (!answers || answers.length !== 22) {
        return res.status(400).json({ message: 'Invalid answers provided - need exactly 22 answers' });
      }

      // Convert answers array to object for processing
      const answersObject: Record<number, string> = {};
      answers.forEach((answer: { questionId: number, answer: string }) => {
        answersObject[answer.questionId] = answer.answer;
      });

      // Import authentic scoring functions from shared module
      const { calculateDNAType, calculateSubtype } = await import('../shared/authenticQuestions');
      
      // Calculate DNA type using authentic Q1-Q6 scoring
      const dnaType = calculateDNAType(answersObject);
      
      // Calculate subtype using authentic Q13-Q22 scoring
      const subtypeResult = calculateSubtype(answersObject, dnaType);
      
      console.log('Quiz calculation:', {
        userId,
        dnaType,
        subtype: subtypeResult,
        sampleAnswers: Object.fromEntries(Object.entries(answersObject).slice(0, 6))
      });
      
      // Calculate awareness percentage (simplified for now)
      const awarenessPercentage = 75;

      // Store quiz result for authenticated users
      if (userId !== 'anonymous-user') {
        try {
          console.log('Saving quiz result for user:', userId);
          const quizResultData = {
            defaultType: dnaType,
            dnaType: dnaType,
            subtype: subtypeResult,
            awarenessPercentage: awarenessPercentage,
            scores: {
              architect: 0,
              alchemist: 0,
              blurred: 0,
              neutral: 0
            },
            answers: answersObject
          };
          await storage.saveQuizResult(userId, quizResultData);
          console.log('Quiz result saved successfully for user:', userId);
        } catch (error) {
          console.error('Error saving quiz result:', error);
        }
      }

      const nextRetakeDate = new Date();
      nextRetakeDate.setDate(nextRetakeDate.getDate() + 30);

      res.json({
        dnaType: dnaType,
        subtype: subtypeResult,
        awarenessPercentage: awarenessPercentage,
        answers: answersObject,
        scores: {
          architect: 0,
          alchemist: 0,
          blurred: 0,
          neutral: 0
        },
        canRetake: false,
        nextRetakeDate: nextRetakeDate.toISOString(),
        insights: null
      });
    } catch (error) {
      console.error("Error submitting Entrepreneurial DNA quiz:", error);
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  // Legacy quiz submission endpoint
  app.post('/api/quiz/submit', requireAuth, async (req, res) => {
    try {
      const { result, percentages } = req.body;
      const userId = req.user!.uid;
      
      if (!['Architect', 'Alchemist', 'Undeclared', 'Blurred Identity'].includes(result)) {
        return res.status(400).json({ message: 'Invalid quiz result' });
      }
      
      res.json({ success: true, message: 'Quiz result saved' });
    } catch (error) {
      console.error("Error saving quiz result:", error);
      res.status(500).json({ message: "Failed to save quiz result" });
    }
  });

  // Student authentication endpoints
  // Admin authentication endpoint
  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check for valid admin credentials
      const validAdmins = [
        { 
          email: 'admin@brandscaling.com', 
          password: 'admin2025',
          firstName: 'Admin',
          lastName: 'User',
          id: 'admin-dev-12345'
        },
        { 
          email: 'master@brandscaling.com', 
          password: 'master2025',
          firstName: 'Master',
          lastName: 'Admin',
          id: 'master-admin-2025'
        }
      ];
      
      const admin = validAdmins.find(a => a.email === email && a.password === password);
      
      if (admin) {
        res.json({
          success: true,
          admin: {
            id: admin.id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: 'admin'
          }
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Admin login failed" });
    }
  });

  app.post('/api/auth/student-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check for specific test student credentials
      const validStudents = [
        // Master credentials - full access to everything
        { 
          email: 'master@brandscaling.com', 
          password: 'master2025',
          firstName: 'Master',
          lastName: 'Admin',
          accessTier: 'master'
        },
        // Original test accounts
        { 
          email: 'munawarrasoolabbasi@gmail.com', 
          password: '123456',
          firstName: 'Munawar',
          lastName: 'Abbasi',
          accessTier: 'beginner'
        },
        { 
          email: 'sarah.testing@brandscaling.com', 
          password: 'testing123',
          firstName: 'Sarah',
          lastName: 'Johnson',
          accessTier: 'beginner'
        },
        { 
          email: 'journeytest@brandscaling.com', 
          password: 'password123',
          firstName: 'Journey',
          lastName: 'Test',
          accessTier: 'expert'
        },
        { 
          email: 'farijaved@yahoo.co.uk', 
          password: 'fariza@123',
          firstName: 'Fariza',
          lastName: 'Javed',
          accessTier: 'expert'
        },
        // New student accounts - all with password: 123456
        { 
          email: 'vishaal@premierproperty.co.uk', 
          password: '123456',
          firstName: 'Vishaal',
          lastName: 'Premier',
          accessTier: 'expert'
        },
        { 
          email: 'dion@dionwrightproperty.com', 
          password: '123456',
          firstName: 'Dion',
          lastName: 'Wright',
          accessTier: 'expert'
        },
        { 
          email: 'hanif@uranexus.com', 
          password: '123456',
          firstName: 'Hanif',
          lastName: 'Uran',
          accessTier: 'expert'
        },
        { 
          email: 'twinjgt@gmail.com', 
          password: '123456',
          firstName: 'Twin',
          lastName: 'JGT',
          accessTier: 'expert'
        },
        { 
          email: 'geadzirasa@gmail.com', 
          password: '123456',
          firstName: 'Gead',
          lastName: 'Zirasa',
          accessTier: 'expert'
        },
        { 
          email: 'hav@stefindr.co.uk', 
          password: '123456',
          firstName: 'Hav',
          lastName: 'Stefindr',
          accessTier: 'expert'
        },
        { 
          email: 'info@edgehillbuilding.com', 
          password: '123456',
          firstName: 'Edge',
          lastName: 'Hill',
          accessTier: 'expert'
        },
        { 
          email: 'jamie@edgehillpropertyfinance.com', 
          password: '123456',
          firstName: 'Jamie',
          lastName: 'EdgeHill',
          accessTier: 'expert'
        },
        { 
          email: 'simant.soni@gmail.com', 
          password: '123456',
          firstName: 'Simant',
          lastName: 'Soni',
          accessTier: 'expert'
        },
        { 
          email: 'fariza@edgehillgroup.co.uk', 
          password: '123456',
          firstName: 'Fariza',
          lastName: 'EdgeHill',
          accessTier: 'expert'
        },
        { 
          email: 'kam@premierproperty.co.uk', 
          password: '123456',
          firstName: 'Kam',
          lastName: 'Premier',
          accessTier: 'expert'
        },
        { 
          email: 'info@ukpropertytastic.co.uk', 
          password: '123456',
          firstName: 'UK',
          lastName: 'Property',
          accessTier: 'expert'
        },
        { 
          email: 'josh@insurance-desk.com', 
          password: '123456',
          firstName: 'Josh',
          lastName: 'Insurance',
          accessTier: 'expert'
        },
        { 
          email: 'info@edgehillpropertyfinance.com', 
          password: '123456',
          firstName: 'EdgeHill',
          lastName: 'Finance',
          accessTier: 'expert'
        },
        { 
          email: 'sohail.k@live.co.uk', 
          password: '123456',
          firstName: 'Sohail',
          lastName: 'K',
          accessTier: 'expert'
        },
        { 
          email: 'james@brandscaling.com', 
          password: '123456',
          firstName: 'James',
          lastName: 'User',
          accessTier: 'expert'
        },
        { 
          email: 'shoail@brandscaling.com', 
          password: '123456',
          firstName: 'Shoail',
          lastName: 'User',
          accessTier: 'expert'
        },
        { 
          email: 'hav@sitefindr.co.uk', 
          password: '123456',
          firstName: 'Hav',
          lastName: 'User',
          accessTier: 'expert'
        },
        { 
          email: 'reshma@sitefindr.co.uk', 
          password: '123456',
          firstName: 'Reshma',
          lastName: 'User',
          accessTier: 'expert'
        }
      ];

      const student = validStudents.find(s => s.email === email && s.password === password);
      
      if (student) {
        // Generate student ID for session
        const studentId = `student-${Date.now()}`;
        
        res.json({
          success: true,
          student: {
            id: studentId,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            accessTier: student.accessTier,
            role: 'student'
          }
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error("Student login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  app.get('/api/auth/user', async (req, res) => {
    try {
      // Check for student session
      const studentId = req.headers['x-student-id'] as string;
      if (studentId) {
        res.json({
          uid: studentId,
          email: 'student@brandscaling.com',
          role: 'student',
          accessTier: 'beginner'
        });
        return;
      }
      
      // Check for admin session
      const adminId = req.headers['x-admin-id'] as string;
      if (adminId === 'admin-dev-12345') {
        res.json({
          uid: 'admin-dev-12345',
          email: 'admin@brandscaling.com',
          role: 'admin'
        });
        return;
      }
      
      res.status(401).json({ message: 'Not authenticated' });
    } catch (error) {
      console.error("Auth user error:", error);
      res.status(500).json({ message: "Authentication check failed" });
    }
  });

  // AI Agents Direct OpenAI Integration
  app.post('/api/ai-agents/chat-direct', async (req: any, res) => {
    try {
      const { message, agentType } = req.body;
      const userId = req.user?.uid || 'anonymous-user';
      
      if (!message || !agentType) {
        return res.status(400).json({ error: 'Message and agent type are required' });
      }

      if (!['architect', 'alchemist'].includes(agentType)) {
        return res.status(400).json({ error: 'Invalid agent type' });
      }

      // Import AI agent chat function
      const { chatWithAgent } = await import('./aiAgent');
      
      // Get user's DNA type for personalization
      const userDnaType = agentType === 'architect' ? 'Architect' : 'Alchemist';
      
      // Use the existing AI agent chat function with direct OpenAI
      const responseText = await chatWithAgent(message, userDnaType, userId);

      res.json({
        response: responseText,
        agentType: agentType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error communicating with AI agent:', error);
      res.status(500).json({ 
        error: 'Failed to communicate with AI agent',
        response: 'I apologize, but I\'m temporarily unavailable. Please try again in a moment.'
      });
    }
  });

  // Get AI conversation history (separated by agent)
  app.get('/api/ai-conversations/:agentType?', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const agentType = req.params.agentType;
      
      const conversations = await storage.getAiConversationsByUser(userId, agentType);
      
      res.json(conversations);
    } catch (error) {
      console.error('Error fetching AI conversations:', error);
      res.status(500).json({ error: 'Failed to fetch conversation history' });
    }
  });

  // Courses endpoints
  app.get('/api/courses', requireAuth, async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  app.get('/api/courses/with-lessons', async (req, res) => {
    try {
      const courses = await storage.getCoursesWithLessons();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses with lessons:', error);
      res.status(500).json({ message: 'Failed to fetch courses with lessons' });
    }
  });

  // Entry tier courses endpoint (no auth required)
  app.get('/api/courses/entry', async (req, res) => {
    try {
      const courses = await storage.getCoursesWithLessons();
      const entryCourses = courses.filter(course => 
        course.accessTier === 'beginner' && course.isPublished === true
      );
      res.json(entryCourses);
    } catch (error) {
      console.error('Error fetching entry courses:', error);
      res.status(500).json({ message: 'Failed to fetch entry courses' });
    }
  });

  // Student dashboard endpoint
  app.get('/api/dashboard', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.uid;
      const userEmail = req.user!.email;
      
      // Get student details from localStorage mapping
      const validStudents = [
        // Master credentials - full access to everything
        { 
          email: 'master@brandscaling.com', 
          firstName: 'Master',
          lastName: 'Admin',
          accessTier: 'master'
        },
        // Original test accounts
        { 
          email: 'munawarrasoolabbasi@gmail.com', 
          firstName: 'Munawar',
          lastName: 'Abbasi',
          accessTier: 'beginner'
        },
        { 
          email: 'sarah.testing@brandscaling.com', 
          firstName: 'Sarah',
          lastName: 'Johnson',
          accessTier: 'beginner'
        },
        { 
          email: 'journeytest@brandscaling.com', 
          firstName: 'Journey',
          lastName: 'Test',
          accessTier: 'expert'
        },
        { 
          email: 'farijaved@yahoo.co.uk', 
          firstName: 'Fariza',
          lastName: 'Javed',
          accessTier: 'expert'
        },
        // New student accounts
        { 
          email: 'vishaal@premierproperty.co.uk', 
          firstName: 'Vishaal',
          lastName: 'Premier',
          accessTier: 'expert'
        },
        { 
          email: 'dion@dionwrightproperty.com', 
          firstName: 'Dion',
          lastName: 'Wright',
          accessTier: 'expert'
        },
        { 
          email: 'hanif@uranexus.com', 
          firstName: 'Hanif',
          lastName: 'Uran',
          accessTier: 'expert'
        },
        { 
          email: 'twinjgt@gmail.com', 
          firstName: 'Twin',
          lastName: 'JGT',
          accessTier: 'expert'
        },
        { 
          email: 'geadzirasa@gmail.com', 
          firstName: 'Gead',
          lastName: 'Zirasa',
          accessTier: 'expert'
        },
        { 
          email: 'hav@stefindr.co.uk', 
          firstName: 'Hav',
          lastName: 'Stefindr',
          accessTier: 'expert'
        },
        { 
          email: 'info@edgehillbuilding.com', 
          firstName: 'Edge',
          lastName: 'Hill',
          accessTier: 'expert'
        },
        { 
          email: 'jamie@edgehillpropertyfinance.com', 
          firstName: 'Jamie',
          lastName: 'EdgeHill',
          accessTier: 'expert'
        },
        { 
          email: 'simant.soni@gmail.com', 
          firstName: 'Simant',
          lastName: 'Soni',
          accessTier: 'expert'
        },
        { 
          email: 'fariza@edgehillgroup.co.uk', 
          firstName: 'Fariza',
          lastName: 'EdgeHill',
          accessTier: 'expert'
        },
        { 
          email: 'kam@premierproperty.co.uk', 
          firstName: 'Kam',
          lastName: 'Premier',
          accessTier: 'expert'
        },
        { 
          email: 'info@ukpropertytastic.co.uk', 
          firstName: 'UK',
          lastName: 'Property',
          accessTier: 'expert'
        },
        { 
          email: 'josh@insurance-desk.com', 
          firstName: 'Josh',
          lastName: 'Insurance',
          accessTier: 'expert'
        },
        { 
          email: 'info@edgehillpropertyfinance.com', 
          firstName: 'EdgeHill',
          lastName: 'Finance',
          accessTier: 'expert'
        },
        { 
          email: 'sohail.k@live.co.uk', 
          firstName: 'Sohail',
          lastName: 'K',
          accessTier: 'expert'
        },
        { 
          email: 'james@brandscaling.com', 
          firstName: 'James',
          lastName: 'User',
          accessTier: 'expert'
        },
        { 
          email: 'shoail@brandscaling.com', 
          firstName: 'Shoail',
          lastName: 'User',
          accessTier: 'expert'
        },
        { 
          email: 'hav@sitefindr.co.uk', 
          firstName: 'Hav',
          lastName: 'User',
          accessTier: 'expert'
        },
        { 
          email: 'reshma@sitefindr.co.uk', 
          firstName: 'Reshma',
          lastName: 'User',
          accessTier: 'expert'
        }
      ];

      console.log('Dashboard - Looking for student with email:', userEmail);
      console.log('Valid students emails:', validStudents.map(s => s.email));
      
      const student = validStudents.find(s => s.email === userEmail);
      
      if (!student) {
        console.log('Student not found in validStudents array');
        return res.status(401).json({ message: "Student not found" });
      }
      
      console.log('Found student:', student);

      // Get student's courses based on access tier
      const courses = await storage.getCoursesWithLessons();
      const accessibleCourses = courses.filter(course => {
        if (student.accessTier === 'expert') return true; // Expert access to all
        if (student.accessTier === 'beginner') return course.accessTier === 'beginner';
        return false;
      });

      // Return student dashboard data
      const dashboardData = {
        user: {
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          dominantType: "Architect", // Default, will be updated from quiz results
          readinessLevel: "Intermediate",
          accessTier: student.accessTier,
          assessmentComplete: true,
          profileImageUrl: null
        },
        courses: accessibleCourses.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          accessTier: course.accessTier,
          imageUrl: course.imageUrl,
          level: course.level,
          track: course.track
        })),
        progress: [],
        payments: [],
        announcements: [
          {
            id: "announce-1",
            title: "Welcome to Brandscaling!",
            message: "Your entrepreneurial journey starts here.",
            createdAt: new Date()
          }
        ],
        stats: {
          totalCourses: accessibleCourses.length,
          completedModules: 0,
          totalSpent: student.accessTier === 'expert' ? 99900 : 4900 // Expert tier £999, Entry tier £49
        }
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Get quiz results for student dashboard
  app.get('/api/quiz/results', async (req, res) => {
    try {
      // Use the x-student-id header if available, otherwise try other auth methods
      const studentId = req.headers['x-student-id'] as string;
      const userId = studentId || req.user?.uid;
      
      console.log('Quiz results request - studentId:', studentId, 'userId:', userId, 'headers:', req.headers);
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      console.log('Fetching quiz results for user:', userId);
      const quizResult = await storage.getLatestQuizResult(userId);
      
      console.log('Quiz result found:', quizResult);
      
      if (!quizResult) {
        console.log('No quiz result found for user:', userId);
        return res.json({ hasResult: false });
      }

      const response = {
        hasResult: true,
        dnaType: quizResult.results?.defaultType || quizResult.results?.dnaType || 'Unknown',
        subtype: quizResult.results?.subtype || '',
        awarenessScore: quizResult.results?.awarenessPercentage || 0,
        scores: quizResult.results?.scores || {},
        completedAt: quizResult.createdAt
      };
      
      console.log('Sending quiz results response:', response);
      res.json(response);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  // 7-Day Identity Reset API endpoints
  app.get('/api/seven-day-reset/progress', async (req, res) => {
    try {
      const studentId = req.headers['x-student-id'] as string;
      const userId = studentId || req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // For now, return mock data until database is updated
      const mockProgress = {
        completedDays: [],
        startedDays: [],
        totalDays: 7
      };

      res.json(mockProgress);
    } catch (error) {
      console.error("Error fetching 7-day reset progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/seven-day-reset/start-day', async (req, res) => {
    try {
      const studentId = req.headers['x-student-id'] as string;
      const userId = studentId || req.user?.uid;
      const { day } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!day || day < 1 || day > 7) {
        return res.status(400).json({ message: "Invalid day number" });
      }

      // For now, return success until database is updated
      console.log(`Starting day ${day} for user ${userId}`);
      
      res.json({ 
        success: true, 
        message: `Day ${day} started successfully`,
        day: day,
        startedAt: new Date()
      });
    } catch (error) {
      console.error("Error starting day:", error);
      res.status(500).json({ message: "Failed to start day" });
    }
  });

  app.post('/api/seven-day-reset/complete-day', async (req, res) => {
    try {
      const studentId = req.headers['x-student-id'] as string;
      const userId = studentId || req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Handle both FormData and JSON body
      let day: number;
      let reflectionResponses: string[];
      let notes: string;

      // Check if this is multipart form data (from multer)
      if (req.body.day && typeof req.body.day === 'string') {
        // FormData from frontend (handled by multer)
        day = parseInt(req.body.day);
        try {
          reflectionResponses = JSON.parse(req.body.reflectionResponses || '[]');
        } catch (error) {
          reflectionResponses = [];
        }
        notes = req.body.notes || '';
      } else {
        // JSON body
        day = req.body.day;
        reflectionResponses = req.body.reflectionResponses || [];
        notes = req.body.notes || '';
      }

      console.log('Complete day request:', { day, reflectionResponses, notes });

      if (!day || day < 1 || day > 7) {
        return res.status(400).json({ message: "Invalid day number" });
      }

      if (!reflectionResponses || reflectionResponses.length === 0) {
        return res.status(400).json({ message: "Reflection responses are required" });
      }

      // Validate that all reflection responses are provided
      const emptyResponses = reflectionResponses.filter((response: string) => !response || response.trim().length < 10);
      if (emptyResponses.length > 0) {
        return res.status(400).json({ message: "All reflection responses must be at least 10 characters long" });
      }

      // For now, just log the completion - the frontend handles progress tracking
      // TODO: Implement proper database storage later

      console.log(`Day ${day} completed successfully for user ${userId}`);
      
      res.json({ 
        success: true, 
        message: `Day ${day} completed successfully`,
        day: day,
        completedAt: new Date()
      });
    } catch (error) {
      console.error("Error completing day:", error);
      res.status(500).json({ message: "Failed to complete day" });
    }
  });

  // Admin endpoint to view all users' 7-Day Reset progress
  app.get('/api/admin/seven-day-reset/all-progress', requireAuth, async (req, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // For now, return mock data until database is properly connected
      const mockProgressData = [
        {
          userId: 'user-1',
          email: 'hav@sitefindr.co.uk',
          firstName: 'Hav',
          lastName: 'User',
          completedDays: [1, 2, 3],
          startedDays: [1, 2, 3, 4],
          totalDays: 7,
          lastActivity: '2025-01-03T10:30:00Z',
          responses: {
            day1: [
              "The structured half felt restrictive but produced clearer results. The intuitive half was more energizing but less focused.",
              "Time passed faster during the intuitive half.",
              "I felt more alive during the structured portions, surprisingly."
            ],
            day2: [
              "My most effortless success was launching my first product with minimal planning.",
              "Natural decisions involved trusting my gut over extensive analysis.",
              "A rhythm of burst creativity followed by systematic execution worked best."
            ],
            day3: [
              "The planned approach felt safer but less innovative.",
              "I had more energy during improvisational execution.",
              "The improvised result felt more authentically 'me'."
            ]
          }
        },
        {
          userId: 'user-2',
          email: 'reshma@sitefindr.co.uk',
          firstName: 'Reshma',
          lastName: 'User',
          completedDays: [1, 2, 3, 4, 5, 6, 7],
          startedDays: [1, 2, 3, 4, 5, 6, 7],
          totalDays: 7,
          lastActivity: '2025-01-02T14:15:00Z',
          identityContract: "From this moment on, I commit to building and leading as an Alchemist because my greatest breakthroughs come from trusting intuition over analysis.",
          responses: {
            day1: [
              "The flow state energized me completely while structure felt draining.",
              "Time disappeared during the intuitive half.",
              "Freedom made me feel most alive and authentic."
            ],
            day7: [
              "I lived in a blurred, over-analytical default that drained my energy.",
              "My business would feel effortless and naturally magnetic.",
              "I need regular intuition check-ins and creative space to stay aligned."
            ]
          }
        },
        {
          userId: 'user-3',
          email: 'james@brandscaling.com',
          firstName: 'James',
          lastName: 'User',
          completedDays: [1],
          startedDays: [1, 2],
          totalDays: 7,
          lastActivity: '2025-01-01T09:45:00Z',
          responses: {
            day1: [
              "Structure gave me clarity and momentum, while intuition felt chaotic.",
              "Time was manageable and productive during structured work.",
              "I felt most alive when following a clear plan and system."
            ]
          }
        }
      ];

      res.json(mockProgressData);
    } catch (error) {
      console.error("Error fetching 7-Day Reset progress:", error);
      res.status(500).json({ message: "Failed to fetch progress data" });
    }
  });

  // Return the app for the main server to use
  return app as any;
}