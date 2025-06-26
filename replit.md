# Brandscaling Platform

## Overview

The Brandscaling Platform is a full-stack AI-powered business operating system that helps entrepreneurs discover their Entrepreneurial DNA and scale their businesses from idea to 9-figures. The platform combines React frontend with Node.js/Express backend, using PostgreSQL for data persistence and Supabase for authentication.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theme support
- **State Management**: TanStack Query for server state, React Context for global state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript (ESM modules)
- **Framework**: Express.js for API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Supabase Auth with JWT tokens
- **Development**: tsx for TypeScript execution in development

### Database Architecture
- **Primary Database**: PostgreSQL via Neon Database (production) or local PostgreSQL (development)
- **Schema Management**: Drizzle Kit for migrations
- **Tables**: Users, quiz results, courses, lessons, and related entities

## Key Components

### Authentication System
- **Primary**: Supabase authentication with email/password and social providers
- **Fallback**: Development authentication system for local testing
- **Authorization**: Role-based access control (admin, student) with tier-based permissions (beginner, intermediate, advanced, mastermind)

### DNA Quiz System
- **Quiz Engine**: Custom scoring algorithm that determines user's entrepreneurial type
- **Types**: Architect (systematic/analytical) or Alchemist (intuitive/creative)
- **Results**: Provides personalized insights, strengths, challenges, and recommendations
- **Retake Logic**: Time-based restrictions on quiz retakes

### Learning Management System (LMS)
- **Adaptive Content**: Different content paths based on user's DNA type
- **Tier-based Access**: Content gated by subscription tier
- **Progress Tracking**: User progress through courses and lessons
- **Multi-format Content**: Support for various content types (video, text, interactive)

### Admin Panel
- **Course Management**: CRUD operations for courses and lessons
- **User Management**: View and manage user accounts and access levels
- **Analytics Dashboard**: Business metrics and user engagement data
- **Community Moderation**: Manage forum posts and user interactions

### Theme System
- **Dynamic Theming**: Architect (blue) vs Alchemist (gold) color schemes
- **CSS Variables**: Theme switching through CSS custom properties
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Data Flow

### User Registration & Onboarding
1. User registers via Supabase Auth
2. Profile created in users table
3. User takes DNA quiz
4. Results stored and user type determined
5. Personalized dashboard and content recommendations generated

### Content Access Flow
1. User requests course/content
2. Backend validates user's subscription tier
3. Content filtered based on tier and DNA type
4. Personalized content served to frontend
5. Progress tracked and stored

### Admin Operations
1. Admin authenticates with elevated permissions
2. Admin panel provides CRUD interfaces
3. All changes logged and validated
4. Real-time updates pushed to affected users

## External Dependencies

### Authentication & Database
- **Supabase**: Authentication, real-time subscriptions
- **Neon Database**: Managed PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations

### Payment Processing
- **Stripe**: Subscription management and payment processing
- **Integration**: Webhook handling for subscription updates

### AI & Communication
- **Anthropic Claude**: AI-powered content generation and assistance
- **Email**: Automated email campaigns and notifications

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework

## Deployment Strategy

### Development Environment
- **Local Database**: PostgreSQL with Drizzle migrations
- **Development Server**: Vite dev server with HMR
- **Environment Variables**: Local .env file configuration

### Production Environment
- **Platform**: Replit Autoscale deployment
- **Database**: Neon Database (PostgreSQL)
- **Build Process**: Vite build for frontend, esbuild for backend
- **Environment**: Production environment variables via Replit secrets

### Build Configuration
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Node.js server to `dist/index.js`
- **Assets**: Static assets served from build directory
- **Port Configuration**: Server runs on port 5000, external port 80

## Changelog

```
Changelog:
- June 26, 2025. ENHANCED AUTHENTICATION FLOW: Implemented seamless login-to-quiz-to-dashboard flow. After login/signup, users are redirected directly to Entrepreneurial DNA Quiz. After completing quiz, users are automatically redirected to appropriate dashboard based on their access tier (Entry tier → /entry, other students → /student, admins → /admin). Added 5-second delay on quiz results with automatic redirect and manual dashboard access button.
- June 26, 2025. SIGNOUT FUNCTIONALITY ADDED: Added sign out buttons to both Student Dashboard and Entry Dashboard. Users can now properly log out from their respective dashboards with clean localStorage clearing and homepage redirect.
- June 26, 2025. ENTRY TIER ACCESS SYSTEM COMPLETE: Added "pricing" ID to pricing section for direct navigation. Created Entry tier course access system with 4 specific courses (Idea-to-Launch Kit™, Smart Business Builder™, AI Mentor Access, 30-Day Launch Plan). Built dedicated Entry Dashboard with read-only course access at /entry route. Updated authentication flow so logged-in users clicking login icon redirect to appropriate dashboard based on tier (Entry tier → /entry, other students → /student, admins → /admin).
- June 26, 2025. PRICING & ELITE LINK UPDATED: Updated pricing structure to Entry (£499/£49 with LAUNCH49), Expert (£999), Elite (£20k). Elite tier now links to specific GHL mastermind landing page. Implemented LAUNCH49 discount code system with £450 off Entry tier, 24-hour validity, 1000 usage limit, and automatic validation through webhook.
- June 26, 2025. GOHIGHLEVEL INTEGRATION COMPLETE & TESTED: Fixed all TypeScript compilation errors, webhook endpoint fully functional and tested. Entry (£49) and Elite (£20k) purchases automatically create user accounts, generate secure 12-character passwords, and trigger credential emails via Resend API. Complete purchase-to-platform flow: GHL Landing → Stripe → Webhook → Account + Email. Production ready.
- June 26, 2025. GOHIGHLEVEL INTEGRATION COMPLETE: Connected Brandscaling platform with GoHighLevel landing pages and checkout system. Entry/Elite buttons now link to GHL pages, webhook endpoint handles purchase completion, automatic account creation and credential delivery via email. Complete purchase flow: Homepage → GHL Landing → Checkout → Webhook → Account + Email.
- June 26, 2025. PURCHASE-TO-CREDENTIALS SYSTEM COMPLETE: Implemented full automated workflow where Entry (£49) and Elite (£20k) purchases automatically generate secure login credentials and send professional welcome emails via Resend. Removed signup functionality - users only receive accounts after purchase. Authentication system updated to sign-in only with purchase guidance.
- June 26, 2025. PRICING UPDATED: Entry tier changed from £99 to £249 with "Today Only Special" £49 discount prominently displayed. Expert tier updated to £999. Complete visual styling with strikethrough original prices and green highlighting for special offers.
- June 24, 2025. PRICING SECTION ADDED: Added "Choose Your Growth Path" pricing section to homepage between DNA quiz and recognition sections with Entry (£99), Expert (£249), and Elite (£20k) tiers featuring authentic program names and features.
- June 24, 2025. AI AGENTS FUNCTIONAL: Fixed database schema mismatch for AI conversations, updated storage methods to match actual table structure, resolved "content column does not exist" errors. AI Agents now fully accessible from homepage buttons with working chat functionality.
- June 24, 2025. AI AGENTS SEPARATED: Fixed AI Advisors to have completely separate chat conversations (Architect vs Alchemist), replaced n8n webhook integration with direct OpenAI API calls, implemented independent conversation histories for each agent.
- June 24, 2025. SCORING LOGIC IMPLEMENTED: Added user's exact scoring algorithm (4+ 🟪=Architect, 4+ 🟧=Alchemist, <4 either=Blurred Identity) with authentic type counting and result calculation. Quiz system now fully functional with user's specifications.
- June 24, 2025. FINAL CLEANUP COMPLETE: Updated quiz system to user's exact type mapping specifications (🟪=architect, 🟧=alchemist, 🔴=blurred, ⚪=neutral), removed all DNA subtypes and unnecessary data, systematically deleted ALL fake/placeholder content throughout site. Quiz now contains only user's authentic 6 questions with exact type mappings. Zero unauthorized content remains.
- June 24, 2025. CRITICAL FIX: Removed all placeholder/fake content from E-DNA quiz system and implemented user's exact Q1-Q6 questions with precise scoring logic (4+ = clear type, otherwise Blurred Identity)
- June 24, 2025. Enhanced E-DNA Quiz System Complete: Implemented comprehensive 12-subtype assessment with detailed personality profiles, enhanced scoring algorithm, and rich result displays
- June 24, 2025. Workbook Upload Processing Complete: Fixed authentication barriers, implemented real-time status updates from "processing" to "completed", added proper database storage and frontend polling for seamless user experience
- June 24, 2025. AI Agents communication improved: Enhanced prompts and fallback responses to ensure Architect provides structured business advice and Alchemist gives practical yet creative guidance
- June 24, 2025. Hero background video perfected: Clean, clearly visible animated logo video as background in Landing.tsx hero section with 100% opacity for professional presentation
- June 24, 2025. Phase 2 Complete: Student Course Content System fully functional - course browsing, filtering, DNA personalization, and course viewing with lesson management
- June 24, 2025. Fixed routing issues and authentication context - student routes now properly accessible with DNA-based personalization 
- June 24, 2025. Student course interface complete - professional UI with progress tracking, access control, and personalized recommendations
- June 24, 2025. Phase 1 Complete: Admin Course CRUD Operations fully functional - course creation, editing, deletion, file uploads, and lesson management working
- June 24, 2025. Fixed admin authentication flow - all course management operations now authenticate properly with x-admin-id headers
- June 24, 2025. File upload system operational - supports course images, lesson videos, and workbooks with proper validation
- June 24, 2025. Admin course management UI complete - professional styling, forms, dialogs, and CRUD operations
- June 23, 2025. Fixed student authentication system - middleware now properly recognizes custom student auth headers
- June 23, 2025. Resolved student dashboard loading issues - authentication flow working end-to-end
- June 23, 2025. Complete file conflict resolution - removed old navigation components, fixed header/footer branding
- June 23, 2025. Landing page fully transformed with Brandscaling 2025 brand system
- June 23, 2025. Brandscaling 2025 Brand Kit implemented - complete visual identity, color system, typography, and brand voice
- June 23, 2025. AI Agents system fully functional with n8n webhook integration - message handling fixed
- June 23, 2025. Interactive Workbooks system implemented with DNA personalization and file upload
- June 23, 2025. AI Agents authentication issues resolved - both agents now working properly
- June 23, 2025. Student Dashboard now accessible via /student and /test-student routes
- June 23, 2025. AI Agents system fully tested and working with n8n webhooks
- June 23, 2025. Enhanced LMS Core System with DNA personalization completed
- June 23, 2025. AI Agents system integrated with n8n webhooks
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```