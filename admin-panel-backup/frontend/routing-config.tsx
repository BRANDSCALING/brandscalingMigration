// Admin Panel Routing Configuration
// Extract from client/src/App.tsx

import AdminPanel from "@/pages/admin";

// Role-based route protection for admin panel
const adminRoutes = [
  {
    path: "/admin",
    component: AdminPanel,
    requiresAuth: true,
    requiresRole: "admin"
  },
  {
    path: "/admin/:path*", 
    component: AdminPanel,
    requiresAuth: true,
    requiresRole: "admin"
  }
];

// Admin access control logic
const adminAccessControl = {
  redirectNonAdmins: () => {
    if (!isAuthenticated || userProfile?.role !== 'admin') {
      window.location.href = '/';
    }
  },
  
  roleBasedRedirect: (userProfile: any) => {
    if (userProfile?.role === 'admin') {
      return '/admin';
    }
    return '/student';
  }
};

// JSX Route Configuration (from App.tsx)
/*
{isAuthenticated && userProfile?.role === 'admin' && (
  <>
    <Route path="/admin" component={AdminPanel} />
    <Route path="/admin/:path*" component={AdminPanel} />
  </>
)}
*/

export { adminRoutes, adminAccessControl };