const tierPermissions = {
  beginner: {
    courses: [],
    qna: true,
    strategyDay: false,
    events: false,
    aiAgents: false,
    boardAccess: false
  },
  intermediate: {
    courses: [],
    qna: true,
    strategyDay: false,
    events: false,
    aiAgents: false,
    boardAccess: false
  },
  advanced: {
    courses: 'ALL',
    qna: true,
    strategyDay: true,
    events: true,
    aiAgents: true,
    boardAccess: false
  },
  mastermind: {
    courses: 'ALL',
    qna: true,
    strategyDay: true,
    events: true,
    aiAgents: true,
    boardAccess: true
  }
};

const courseDatabase = {
  // AWAITING USER CONTENT - Course data will be added when provided
};

function hasAccess(userTier, feature, courseId = null) {
  if (!tierPermissions[userTier]) {
    return false;
  }

  const permissions = tierPermissions[userTier];

  if (courseId) {
    if (permissions.courses === 'ALL') {
      return true;
    }
    return permissions.courses.includes(courseId);
  }

  return permissions[feature] || false;
}

function getCourseRequiredTier(courseId) {
  return courseDatabase[courseId]?.requiredTier || 'NextLevel';
}

function getAllowedCourses(userTier) {
  const permissions = tierPermissions[userTier];
  if (!permissions) return [];
  
  if (permissions.courses === 'ALL') {
    return Object.keys(courseDatabase);
  }
  
  return permissions.courses;
}

function getUpgradeTarget(currentTier, desiredFeature, courseId = null) {
  const tiers = ['beginner', 'intermediate', 'advanced', 'mastermind'];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (courseId) {
    const requiredTier = getCourseRequiredTier(courseId);
    return requiredTier;
  }
  
  for (let i = currentIndex + 1; i < tiers.length; i++) {
    if (hasAccess(tiers[i], desiredFeature)) {
      return tiers[i];
    }
  }
  
  return 'mastermind';
}

export {
  tierPermissions,
  courseDatabase,
  hasAccess,
  getCourseRequiredTier,
  getAllowedCourses,
  getUpgradeTarget
};