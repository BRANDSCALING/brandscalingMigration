# Admin Panel Deployment Guide

## Quick Start Checklist

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Required environment variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
DATABASE_URL=your_postgresql_database_url
```

### 2. Database Configuration
```bash
# Push schema to database
npm run db:push

# The following tables will be created:
# - users (with role-based access)
# - courses (with content management)
# - blog_posts (for content creation)
# - events (for event management)
# - sessions (for authentication)
```

### 3. Firebase Setup
1. Create new Firebase project at https://console.firebase.google.com/
2. Enable Authentication with Email/Password provider
3. Add your domain to authorized domains
4. Copy configuration values to environment variables

### 4. Admin User Creation
```bash
# First user to register will need manual role assignment in database:
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 5. Development Server
```bash
npm run dev
# Admin panel accessible at: http://localhost:5000/admin
```

## Security Considerations

### Role-Based Access Control
- All admin routes protected by authentication middleware
- Firebase token validation on every request
- Automatic logout for expired sessions
- Role verification before sensitive operations

### Data Protection
- No fabricated or placeholder data in production
- Real-time metrics from actual database
- Secure API endpoints with proper validation
- Protected file uploads with type checking

## Production Deployment

### Replit Deployment
1. Ensure all environment variables are set in Replit Secrets
2. Database should be properly provisioned
3. Use the "Deploy" button in Replit interface
4. Admin panel will be available at: https://your-app.replit.app/admin

### Custom Domain Setup
1. Configure custom domain in Replit
2. Update Firebase authorized domains
3. Update CORS settings if needed
4. Test all authentication flows

## Troubleshooting

### Common Issues
- **Authentication fails**: Check Firebase configuration and authorized domains
- **Database errors**: Verify DATABASE_URL and run migrations
- **Role access denied**: Ensure user has 'admin' role in database
- **Logout not working**: Clear browser cache and check token expiration

### Debug Mode
Set NODE_ENV=development for detailed error logging and debug information.

## Maintenance

### Regular Tasks
- Monitor user registrations and assign roles as needed
- Review and moderate content submissions
- Update course materials and descriptions
- Check analytics for platform usage patterns

### Backup Procedures
- Regular database backups recommended
- Environment variables should be documented securely
- Test authentication flows after any Firebase updates