# Replit.md - Smart Business Builder

## Overview

This is a full-stack web application built for a Smart Business Builder learning platform. The application features a modular learning system with video content, progress tracking, and user management. It uses a modern React frontend with a Node.js/Express backend, connected to a PostgreSQL database through Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Built-in session handling with connect-pg-simple
- **Development**: TSX for TypeScript execution in development

### Data Storage
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **In-Memory Fallback**: MemStorage class for development/testing

## Key Components

### Database Schema
- **Users Table**: Authentication and user management
- **Modules Table**: Learning module definitions with status tracking
- **User Progress Table**: Individual progress tracking per user/module including video completion states
- **Business Models Table**: Saved AI-generated business models with metadata and user association

### API Endpoints
- `GET /api/intro-status` - Module status and health check
- `GET /api/modules` - Retrieve all available modules
- `GET /api/progress/:userId/:moduleId` - Get user progress for specific module
- `POST /api/progress` - Update user progress
- `POST /api/wizard/step1` - Capture business idea with DNA type selection
- `POST /api/wizard/step2` - Capture problem definition with personality-based prompts
- `POST /api/wizard/step3` - Capture audience identification with targeted approach modes
- `POST /api/wizard/step4` - Capture timing and urgency analysis with market perspectives
- `POST /api/wizard/step5` - Capture offer definition with deliverable vs. transformation focus
- `POST /api/wizard/step6` - Capture revenue model with commercial logic vs. energy exchange approach
- `POST /api/wizard/step7` - Capture cost and effort analysis with financial breakdown vs. personal resource assessment
- `POST /api/wizard/step8` - Capture unique value proposition with competitive advantages vs. authentic differentiation
- `POST /api/wizard/step9` - Capture potential blockers with practical obstacles vs. internal resistance
- `POST /api/wizard/step10` - Capture support needs with technical resources vs. community guidance
- `GET /api/wizard/status` - Get wizard steps status and availability
- `POST /api/generate-model` - Generate AI-powered business model from wizard responses
- `POST /api/save-model` - Save business model to user dashboard
- `GET /api/saved-models/:userId` - Retrieve saved business models for user
- `GET /api/models/user/:userId` - Retrieve saved models for dashboard display with proper formatting
- `GET /api/models/:modelId` - Retrieve individual business model with original answers for editing

### Frontend Components
- **IntroPanel**: Main learning interface component
- **VideoPlayer**: Custom video player with completion tracking
- **ModelOutputPanel**: AI-powered business model generation interface with GPT integration
- **DashboardPanel**: Module 4 dashboard for viewing, editing, and managing saved business models
- **ResumeWizard**: Module 5 component for editing and resubmitting saved models with pre-filled answers
- **Wizard Components**: 10-step business builder wizard with modular steps
  - **Step1_IdeaInput**: Idea capture with Architect/Alchemist DNA toggle
  - **Step2_ProblemInput**: Problem definition with personality-based prompts
  - **Step3_AudienceInput**: Audience identification with targeted approach modes
  - **Step4_TimingInput**: Timing and urgency analysis with market vs. personal perspectives
  - **Step5_OfferInput**: Offer definition with deliverable vs. transformation focus
  - **Step6_RevenueInput**: Revenue model definition with commercial logic vs. energy exchange
  - **Step7_CostInput**: Cost and effort analysis with financial breakdown vs. personal resource assessment
  - **Step8_UspInput**: Unique value proposition with competitive advantages vs. authentic differentiation
  - **Step9_BlockersInput**: Potential blockers identification with practical obstacles vs. internal resistance
  - **Step10_SupportInput**: Support needs assessment with technical resources vs. community guidance
- **UI Components**: Comprehensive set of reusable components via Shadcn/ui

## Data Flow

1. **Module Loading**: Application fetches module status and available modules on startup
2. **Progress Tracking**: User interactions with videos trigger progress updates via API
3. **Wizard Flow**: 10-step wizard captures user inputs with DNA-based personality prompts
4. **AI Processing**: Wizard completion triggers GPT-4 business model generation via OpenAI API
5. **State Synchronization**: TanStack Query manages server state caching and synchronization
6. **Real-time Updates**: Progress changes are immediately reflected in the UI through query invalidation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **@tanstack/react-query**: Server state management
- **drizzle-orm & drizzle-kit**: Database ORM and migrations
- **@radix-ui/***: Headless UI component primitives
- **wouter**: Lightweight routing
- **react-hook-form**: Form state management

### Development Tools
- **Vite**: Build tool with React plugin
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling for server

## Deployment Strategy

The application is configured for Replit deployment with autoscaling:

- **Development**: `npm run dev` starts both frontend and backend in development mode
- **Build Process**: Vite builds the frontend, ESBuild bundles the server
- **Production**: Node.js serves the built application
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Port Configuration**: Server runs on port 5000, exposed as port 80 externally

The application uses a monorepo structure with client, server, and shared directories for clean separation of concerns while maintaining type safety across the full stack.

## Changelog

```
Changelog:
- June 20, 2025. Initial setup with intro panel and video tracking
- June 20, 2025. Added complete 10-step wizard system with all steps functional
- June 20, 2025. Added Module 2: AI-powered business model generation with OpenAI GPT-4 integration
- June 20, 2025. Added Module 3: Dashboard save functionality and PDF export placeholder with PostgreSQL schema
- June 20, 2025. Added Module 4: Dashboard interface for viewing, editing, and managing saved business models with full CRUD operations
- June 20, 2025. Added Module 5: Edit & Resubmit functionality with ResumeWizard component for iterative business model development
- June 20, 2025. Removed all "Module #" references from component headings, replaced with functional titles for better UX
- June 20, 2025. Added Module 1: Business Clarity as entry point with Entrepreneurial DNA selection (Architect/Alchemist) and foundational question
- June 20, 2025. Added Module 3: Product Design with dual-perspective MVP definition, alignment rating slider, and Brandscaling color integration
- June 20, 2025. Added Module 4: Go-to-Market Planning with launch-ready checklist, readiness slider, and dual reflection prompts
- June 20, 2025. Added Module 5: Growth & Feedback Loop with feedback strategy, insights tracking, and improvement analysis
- June 20, 2025. Added Module 6: Interactive Progress Tracker with module completion checklist, energy rating slider, dual reflection system, and PDF export placeholder
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Button colors: Always use Brandscaling colors - Architect Indigo #42047D (blue) and Scale Orange #F6782F (orange).
```