# Brandscaling Platform - ChatGPT Project Export

## Quick Context
This is a production-ready learning management system with AI integration, currently deployed on Replit. The platform features an Entrepreneurial DNA Quiz, admin panel, course management, and Smart Business Builder tool.

## Core Architecture
```
Tech Stack: React + TypeScript + Node.js + Express + PostgreSQL + Firebase Auth
Build Tool: Vite | Styling: Tailwind CSS + shadcn/ui | State: TanStack Query
Database: Drizzle ORM with Neon PostgreSQL | AI: OpenAI GPT-4o
```

## Project Structure
```
brandscaling-platform/
├── client/src/
│   ├── pages/
│   │   ├── Landing.tsx               # Homepage
│   │   ├── EntrepreneurialDnaQuiz.tsx # 20-question assessment
│   │   ├── QuizResult.tsx            # Results display
│   │   ├── SmartBusinessBuilder.tsx  # AI business tool
│   │   ├── Auth.tsx                  # Firebase authentication
│   │   └── admin/                    # Admin panel (5 pages)
│   ├── components/ui/                # shadcn/ui components
│   ├── hooks/                        # useAuth, useFirebaseAuth
│   └── lib/                          # queryClient, utils
├── server/
│   ├── routes.ts                     # All API endpoints
│   ├── firebaseAuth.ts              # Authentication middleware
│   ├── storage.ts                   # Database operations
│   └── db.ts                        # Database connection
├── shared/
│   └── schema.ts                    # Drizzle database schema
└── Configuration files (package.json, vite.config.ts, etc.)
```

## Key Features Implemented
1. **Entrepreneurial DNA Quiz**: 20 questions, 4 personality types, scoring algorithm
2. **Smart Business Builder**: AI-powered business insights using OpenAI
3. **Admin Panel**: Course management, community moderation, user analytics
4. **Authentication**: Firebase with development mode bypass
5. **Database**: Complete schema with users, courses, quiz results, posts

## Database Schema (Drizzle ORM)
```typescript
// Key tables:
users (id, email, role, accessTier, firstName, lastName)
courses (id, title, description, tier, lessons[])
entrepreneurial_dna_quiz_responses (userId, answers, defaultType, scores)
posts (id, authorId, content, tier, replies[])
leads (id, email, source, status)
```

## API Endpoints
```
Authentication:
GET /api/auth/user - Current user info
POST /api/dev/create-admin - Development admin creation

Quiz System:
POST /api/quiz/entrepreneurial-dna/submit - Submit quiz answers
GET /api/quiz/entrepreneurial-dna/eligibility - Check retake status

Courses:
GET /api/courses - List courses
GET /api/courses/:id - Course details

Community:
GET /api/community/posts - Community posts
POST /api/community/posts - Create post

Admin:
GET /api/admin/* - Various admin endpoints

AI Integration:
POST /api/smart-business-builder/generate - AI business insights
```

## Environment Variables Required
```
# Database
DATABASE_URL=postgresql://...

# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...

# OpenAI
OPENAI_API_KEY=...

# Email
RESEND_API_KEY=...

# Marketing
ACTIVECAMPAIGN_API_KEY=...
ACTIVECAMPAIGN_API_URL=...
```

## Current Status
- ✅ Full authentication system (Firebase + dev mode)
- ✅ Complete quiz system with scoring algorithm
- ✅ Admin panel with all CRUD operations
- ✅ AI integration for business insights
- ✅ Responsive UI with Tailwind CSS
- ✅ Type-safe database operations
- ✅ Production deployment ready

## Development Setup
```bash
npm install
npm run db:push
npm run dev
```

## Key Components to Share with ChatGPT

### 1. Main App Router (client/src/App.tsx)
Contains all routing logic and page components

### 2. Database Schema (shared/schema.ts)
Complete Drizzle schema with all tables and relationships

### 3. API Routes (server/routes.ts)
All backend endpoints including quiz scoring algorithm

### 4. Authentication (server/firebaseAuth.ts)
Firebase integration with development fallback

### 5. Quiz Component (client/src/pages/EntrepreneurialDnaQuiz.tsx)
20-question assessment with scoring logic

## What to Tell ChatGPT
"I have a production-ready learning management platform built with React/Node.js/PostgreSQL. It includes an entrepreneurial personality quiz, AI business tools, admin panel, and Firebase authentication. The codebase is fully functional with proper TypeScript, database schemas, and API endpoints. I need help with [specific enhancement/feature/bug fix]."

## Common Enhancement Areas
- Additional AI integrations
- Advanced analytics dashboard
- Mobile responsiveness improvements
- Email automation workflows
- Payment integration (Stripe ready)
- Advanced course content delivery
- Community features expansion

## File Export Commands
To get specific files for ChatGPT:
```bash
# Core files
cat package.json
cat shared/schema.ts
cat server/routes.ts
cat client/src/App.tsx
cat client/src/pages/EntrepreneurialDnaQuiz.tsx

# Configuration
cat vite.config.ts
cat tailwind.config.ts
cat tsconfig.json
```