const { hasAccess, getUpgradeTarget } = require('../tierPermissions');

function checkAccess(feature, courseId = null) {
  return (req, res, next) => {
    try {
      // Get user from Firebase auth token (already decoded in auth middleware)
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'Please log in to access this feature'
        });
      }

      const userTier = user.tier || 'Beginner';
      const hasPermission = hasAccess(userTier, feature, courseId);

      if (!hasPermission) {
        const upgradeTarget = getUpgradeTarget(userTier, feature, courseId);
        
        return res.status(403).json({
          error: 'Access denied',
          message: `This feature requires ${upgradeTarget} tier access`,
          currentTier: userTier,
          requiredTier: upgradeTarget,
          upgradeUrl: `/upgrade?target=${upgradeTarget}`
        });
      }

      req.userTier = userTier;
      next();
    } catch (error) {
      console.error('Access control error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

function checkCourseAccess(req, res, next) {
  const courseId = req.params.courseId || req.body.courseId;
  
  if (!courseId) {
    return res.status(400).json({ error: 'Course ID required' });
  }

  return checkAccess('courses', courseId)(req, res, next);
}

module.exports = {
  checkAccess,
  checkCourseAccess
};