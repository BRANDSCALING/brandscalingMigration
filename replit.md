# Brandscaling Platform

## Overview

The Brandscaling Platform is an AI-powered business operating system designed to help entrepreneurs identify their "Entrepreneurial DNA" and scale their businesses from concept to 9-figures. It provides personalized insights, adaptive learning content, and business tools to support growth. The platform aims to be a comprehensive solution for entrepreneurial development and scaling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform features a dynamic theme system with distinct color schemes for "Architect" (blue) and "Alchemist" (gold) user types, implemented via CSS variables. It adopts a mobile-first responsive design approach using Tailwind CSS. The design system leverages Radix UI components with shadcn/ui for a consistent and modern aesthetic.

### Technical Implementations
- **Frontend**: Built with React 18 and TypeScript, using Vite for fast development and optimized builds. State management is handled by TanStack Query for server state and React Context for global state, with Wouter for client-side routing. Forms are managed with React Hook Form and Zod validation.
- **Backend**: Developed with Node.js and Express.js, utilizing TypeScript and ESM modules. Drizzle ORM provides type-safe database interactions.
- **Authentication**: Integrates Supabase Auth for email/password and social logins, supporting JWT tokens and offering role-based access control (admin, student) with tier-based permissions (beginner, intermediate, advanced, mastermind). A fallback development authentication system is available for local testing.
- **DNA Quiz System**: Features a custom scoring algorithm to determine entrepreneurial types (Architect, Alchemist, or Blurred Identity) and 12 subtypes, providing personalized results and content recommendations. Includes logic for time-based quiz retake restrictions.
- **Learning Management System (LMS)**: Delivers adaptive content tailored to user's DNA type and subscription tier. It supports progress tracking and various content formats (video, text, interactive).
- **Admin Panel**: Provides comprehensive tools for managing courses, users, and content, alongside analytics and community moderation capabilities.

### System Design Choices
- **Database**: PostgreSQL is the primary database, managed by Neon Database in production and local PostgreSQL for development. Drizzle Kit handles schema migrations.
- **Data Flow**: User onboarding involves Supabase registration, profile creation, DNA quiz completion, results storage, and personalized dashboard generation. Content access is controlled by subscription tier and DNA type, with progress tracking. Admin operations involve elevated permissions for content and user management.
- **Deployment**: Development uses local PostgreSQL and Vite dev server. Production deploys to Replit Autoscale with Neon Database, using Vite for frontend builds and esbuild for backend bundling.

## External Dependencies

- **Supabase**: For authentication and real-time subscriptions.
- **Neon Database**: Managed PostgreSQL hosting.
- **Drizzle ORM**: For type-safe database operations.
- **Stripe**: For subscription management and payment processing, including webhook handling.
- **Anthropic Claude**: For AI-powered content generation and assistance.
- **Resend**: For automated email campaigns and notifications.
- **GoHighLevel (GHL)**: Integrated for landing pages, checkout system, and automated account creation post-purchase via webhooks.