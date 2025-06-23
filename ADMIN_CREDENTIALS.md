# Admin Credentials for Brandscaling Platform

## Admin Login Information

### Admin Portal Access
- **URL**: `/admin-login`
- **Portal**: Separate admin authentication flow

### Default Admin Accounts

1. **Primary Admin**
   - **Email**: admin@brandscaling.com
   - **Role**: admin
   - **Access Level**: mastermind (full access)
   - **Status**: Active
   - **Password**: [Encrypted - not accessible]

2. **Developer Admin**
   - **Email**: info@brandscaling.co.uk
   - **Role**: admin
   - **Access Level**: mastermind
   - **Status**: Active
   - **Password**: [Encrypted - not accessible]

3. **Development Admin**
   - **Email**: farizajaved@yahoo.co.uk
   - **Role**: admin
   - **Access Level**: mastermind
   - **Status**: Active
   - **Password**: [Encrypted - not accessible]

## WORKING ADMIN CREDENTIALS

**For Immediate Access:**
- **Email**: `admin@brandscaling.com`  
- **Password**: `brandscaling2025`
- **Portal**: `/admin-login`
- **Role**: admin (full access)

## Password Reset Instructions

If you need to reset passwords for other admin accounts:

1. Use the Firebase console or admin SDK
2. Or create new admin accounts through the admin dashboard once logged in
3. All admin accounts have mastermind-level access

### Authentication Flow

#### Admin Access:
- Admins must use `/admin-login` portal
- Cannot sign up through student portal
- Redirect to admin dashboard after authentication
- No top navigation bar in admin interface

#### Student Access:
- Students use `/auth` portal for login/signup
- Can create new accounts through signup
- Redirect to student dashboard after authentication
- No top navigation bar in student interface

### Admin Account Creation
- New admin accounts can only be created through the admin dashboard
- Admins cannot self-register
- Admin creation requires existing admin privileges

### Security Notes
- Admin and student authentication are completely separated
- Role validation occurs on both frontend and backend
- Unauthorized access attempts are logged and blocked