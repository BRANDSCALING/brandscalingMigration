# Smart Business Builder™ Integration Guide

## Overview

This is a complete Smart Business Builder™ React/Node.js application that you can integrate into your existing Replit project. The application features 6 modules with AI-powered business model generation, progress tracking, and PostgreSQL database integration.

## Installation Steps

### 1. Copy Files to Your Replit Project

Extract all files from the package and copy them to your Replit project directory, maintaining the folder structure:

```
your-project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── ...
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── ...
├── shared/
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── ...
```

### 2. Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

### 3. Environment Variables

You'll need these environment variables in your Replit project:

```env
DATABASE_URL=your_postgresql_database_url
OPENAI_API_KEY=your_openai_api_key
```

### 4. Database Setup

If you have PostgreSQL available:

```bash
npm run db:push
```

This will create all necessary tables based on the Drizzle schema.

### 5. Start the Application

```bash
npm run dev
```

This starts both the frontend (Vite) and backend (Express) servers.

## Key Features

### 6 Complete Modules

1. **Module 1: Business Clarity** - Entrepreneurial DNA assessment (Architect/Alchemist)
2. **Module 2: Business Builder** - 10-step wizard with AI business model generation
3. **Module 3: Product Design** - MVP definition with dual perspectives
4. **Module 4: Go-to-Market** - Launch readiness checklist and planning
5. **Module 5: Growth & Feedback Loop** - Metrics tracking and improvement cycles
6. **Module 6: Progress Tracker** - Module completion tracking and energy assessment

### Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS + Shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **AI Integration**: OpenAI GPT-4 for business model generation

## Integration Points

### API Endpoints

All endpoints are prefixed with `/api/`:

- `/api/business-clarity` - Module 1 data
- `/api/wizard/step1` to `/api/wizard/step10` - Business Builder wizard
- `/api/generate-model` - AI business model generation
- `/api/save-model` - Save models to dashboard
- `/api/product-design` - Module 3 data
- `/api/launch-plan` - Module 4 data
- `/api/feedback-loop` - Module 5 data
- `/api/progress-tracker` - Module 6 data

### Database Schema

The application includes comprehensive PostgreSQL schemas for:
- Users and authentication
- Module progress tracking
- Business model storage
- All module-specific data

### Customization

The application uses Brandscaling colors throughout:
- **Architect Indigo**: `#42047D`
- **Scale Orange**: `#F6782F`
- **Founder Red**: `#EC4049`
- **Strategic Black**: `#0B0B0B`

## File Structure

### Key Components

- `client/src/components/Module1_BusinessClarity.tsx` - Module 1 entry point
- `client/src/components/ModelOutputPanel.tsx` - Module 2 business builder
- `client/src/components/Module3_ProductDesign.tsx` - Product design module
- `client/src/components/Module4_GoToMarket.tsx` - Go-to-market planning
- `client/src/components/Module5_FeedbackLoop.tsx` - Growth feedback loop
- `client/src/components/Module6_ProgressTracker.tsx` - Progress tracking
- `client/src/components/DashboardPanel.tsx` - Main dashboard

### Backend Files

- `server/index.ts` - Main server entry point
- `server/routes.ts` - All API routes
- `server/storage.ts` - Database operations
- `shared/schema.ts` - Database schemas and types

## Navigation Flow

The application follows this module progression:

1. **Module 1** (Business Clarity) → **Module 2** (Business Builder)
2. **Module 2** (Business Builder) → **Module 3** (Product Design)
3. **Module 3** (Product Design) → **Module 4** (Go-to-Market)
4. **Module 4** (Go-to-Market) → **Module 5** (Feedback Loop)
5. **Module 5** (Feedback Loop) → **Module 6** (Progress Tracker)
6. **Module 6** (Progress Tracker) → **Dashboard**

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure `DATABASE_URL` is properly set
2. **OpenAI API**: Verify `OPENAI_API_KEY` is valid for GPT-4 access
3. **Port Conflicts**: The app runs on port 5000 by default
4. **Missing Dependencies**: Run `npm install` if packages are missing

### Development Mode

The application includes both in-memory storage (for development) and PostgreSQL storage (for production). It automatically falls back to in-memory storage if no database is available.

## Support

This is a complete, production-ready application with:
- Full TypeScript support
- Comprehensive error handling
- Mobile-responsive design
- Accessibility features
- SEO optimization
- Modern React patterns

The application is designed to be easily integrated into existing Replit projects while maintaining its modular architecture and database independence.