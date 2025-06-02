BRANDSCALING ADMIN PANEL BACKUP
==================================

This backup contains the complete admin panel section extracted from the Brandscaling platform.

STRUCTURE:
----------
/frontend/
  /pages/admin/           - Main admin panel entry point and routing
  /components/            - Reusable admin UI components  
  /pages/                 - Individual admin page components
  /hooks/                 - Authentication and data fetching hooks
  /lib/                   - Utility functions and API client

/backend/
  /routes/                - API endpoints for admin functionality
  /storage/               - Database operations and queries
  /middleware/            - Authentication and role validation

/shared/
  /schema/                - Database schema and type definitions

RESTORATION STEPS:
------------------
1. Copy frontend files to: client/src/pages/admin/
2. Copy backend files to: server/
3. Copy shared files to: shared/
4. Ensure all dependencies are installed:
   - React Query for data fetching
   - Wouter for routing
   - Firebase for authentication
   - Chart.js for analytics visualization

AUTHENTICATION:
---------------
- Admin access requires userProfile.role === 'admin'
- Firebase authentication with role-based access control
- Route protection at both frontend and backend levels

FEATURES INCLUDED:
------------------
- Dashboard with real user/post statistics
- User management and role assignment
- Post moderation and content management
- Tag management system
- Analytics and insights with authentic data
- Responsive design with mobile sidebar

DATABASE DEPENDENCIES:
----------------------
- PostgreSQL with Drizzle ORM
- Tables: users, posts, tags, comments, sessions
- Analytics queries for real platform metrics

NOTES:
------
- All data displayed is authentic from the platform database
- No mock or placeholder data is used
- Role-based access control prevents unauthorized access
- Mobile-responsive design with proper sidebar functionality