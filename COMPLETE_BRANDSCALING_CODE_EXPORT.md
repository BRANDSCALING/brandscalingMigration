# Brandscaling Platform - Complete Code Export

## Project Overview
The Brandscaling Platform is a comprehensive AI-powered learning management system that delivers intelligent, personalized educational experiences with a focus on adaptive quiz technologies and entrepreneurial DNA assessment.

## Technical Stack
- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Neon hosting
- **ORM**: Drizzle ORM
- **Authentication**: Firebase Auth (with development mode bypass)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Email**: Resend API
- **AI Integration**: OpenAI API
- **Build Tool**: Vite

## Project Structure
```
brandscaling-platform/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   └── Layout.tsx    # Main layout wrapper
│   │   ├── hooks/
│   │   │   ├── useAuth.ts    # Authentication hook
│   │   │   ├── useFirebaseAuth.ts
│   │   │   └── use-toast.ts  # Toast notifications
│   │   ├── lib/
│   │   │   ├── queryClient.ts # React Query setup
│   │   │   └── utils.ts      # Utility functions
│   │   ├── pages/
│   │   │   ├── admin/        # Admin panel pages
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminCourses.tsx
│   │   │   │   ├── AdminCommunity.tsx
│   │   │   │   ├── AdminSettings.tsx
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── EmailCampaigns.tsx
│   │   │   │   ├── EmailTemplates.tsx
│   │   │   │   └── Leads.tsx
│   │   │   ├── student/      # Student dashboard
│   │   │   ├── Landing.tsx   # Main landing page
│   │   │   ├── About.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── Auth.tsx      # Firebase authentication
│   │   │   ├── DevLogin.tsx  # Development login
│   │   │   ├── EntrepreneurialDnaQuiz.tsx
│   │   │   ├── QuizResult.tsx
│   │   │   ├── SmartBusinessBuilder.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx           # Main app with routing
│   │   └── index.css         # Tailwind styles
│   └── index.html
├── server/
│   ├── db.ts                 # Database connection
│   ├── storage.ts            # Data access layer
│   ├── routes.ts             # API routes
│   ├── firebaseAuth.ts       # Firebase authentication
│   ├── index.ts              # Server entry point
│   └── vite.ts               # Vite integration
├── shared/
│   └── schema.ts             # Drizzle database schema
├── public/                   # Static assets
├── package.json
├── tailwind.config.ts
├── vite.config.ts
├── drizzle.config.ts
└── tsconfig.json
```

## Key Features Implemented

### 1. Authentication System
- Firebase authentication with Google OAuth
- Development mode bypass for testing
- Role-based access control (admin, user)
- Secure session management

### 2. Entrepreneurial DNA Quiz
- 20-question personality assessment
- Four DNA types: Architect, Alchemist, Blurred Identity, Unfocused Potential
- Scoring algorithm with tier-based results
- 30-day retest functionality

### 3. Smart Business Builder
- AI-powered business planning tool
- Dual DNA perspective insights
- OpenAI integration for intelligent responses
- Context-aware business strategy recommendations

### 4. Admin Panel
- Complete course management system
- Community post moderation
- User management and analytics
- Email campaign tools
- Settings configuration
- Lead management system

### 5. Learning Management System
- Course content delivery
- Progress tracking
- Video lessons and assessments
- User dashboard with analytics

### 6. Community Features
- Post creation and management
- Tier-based content visibility
- Reply systems and moderation
- Admin oversight tools

## Database Schema

### Core Tables
- `users` - User profiles and authentication
- `courses` - Course content and metadata
- `lessons` - Individual lesson content
- `posts` - Community posts and discussions
- `quiz_results` - Entrepreneurial DNA assessment results
- `leads` - Lead generation and tracking
- `email_logs` - Email campaign tracking

### Key Relationships
- Users have multiple quiz results (with retest functionality)
- Courses contain multiple lessons
- Posts belong to users and have visibility tiers
- Leads track email engagement

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/logout` - Logout user
- `POST /api/dev/create-admin` - Create admin in development

### Quiz System
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/results/:userId` - Get user results
- `GET /api/quiz/can-retake/:userId` - Check retest eligibility

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get specific course
- `GET /api/courses/:id/lessons` - Get course lessons

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
- `PUT /api/community/posts/:id` - Update post
- `DELETE /api/community/posts/:id` - Delete post

### Admin Endpoints
- `GET /api/admin/courses` - Admin course management
- `GET /api/admin/community/posts` - Admin community oversight
- `GET /api/admin/leads` - Lead management
- `GET /api/admin/settings` - System settings

### Smart Business Builder
- `POST /api/smart-business-builder/generate` - Generate business insights

## Environment Variables

### Required for Production
```env
# Database
DATABASE_URL=postgresql://...
PGHOST=...
PGPORT=...
PGUSER=...
PGPASSWORD=...
PGDATABASE=...

# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...

# OpenAI
OPENAI_API_KEY=...

# Email
RESEND_API_KEY=...

# ActiveCampaign
ACTIVECAMPAIGN_API_KEY=...
ACTIVECAMPAIGN_API_URL=...

# Stripe (if payment features needed)
VITE_STRIPE_PUBLIC_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Firebase project configured

### Installation
```bash
# Install dependencies
npm install

# Set up database
npm run db:push

# Start development server
npm run dev
```

### Development Features
- Hot module replacement with Vite
- Development admin login bypass
- TypeScript type checking
- Tailwind CSS with live reload

## Key Components

### 1. Authentication Flow
The platform uses Firebase authentication with a development mode bypass. In production, users authenticate via Google OAuth. In development, there's a special admin login route.

### 2. Quiz Scoring Algorithm
The Entrepreneurial DNA Quiz uses a sophisticated scoring system that evaluates responses across multiple dimensions to classify users into one of four DNA types.

### 3. Admin Panel Architecture
The admin panel is modular with separate components for:
- Course management
- Community moderation
- User analytics
- Email campaigns
- System settings

### 4. Data Access Layer
The storage layer uses Drizzle ORM with PostgreSQL, providing type-safe database operations and automatic migrations.

## Security Features
- Firebase authentication integration
- Role-based access control
- CORS protection
- Input validation with Zod
- Secure session management

## Performance Optimizations
- React Query for efficient data fetching
- Component lazy loading
- Optimized database queries
- Image optimization
- Vite build optimization

## Deployment Considerations
- Environment variable configuration
- Database migration handling
- Firebase project setup
- Domain configuration for authentication
- SSL certificate requirements

## Future Enhancement Opportunities
1. Advanced analytics dashboard
2. Mobile application
3. Additional AI integrations
4. Enhanced community features
5. Payment processing integration
6. Multi-language support

## Code Quality
- TypeScript for type safety
- ESLint configuration
- Consistent component patterns
- Error handling throughout
- Comprehensive logging

This codebase represents a production-ready learning management system with advanced AI integration and comprehensive admin tooling.