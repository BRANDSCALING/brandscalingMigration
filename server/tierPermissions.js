const tierPermissions = {
  beginner: {
    courses: ['getting-started', 'business-idea-lab'],
    qna: true,
    strategyDay: false,
    events: false,
    aiAgents: false,
    boardAccess: false
  },
  intermediate: {
    courses: ['getting-started', 'business-idea-lab', 'frameworks-101', 'foundations'],
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
  'getting-started': { 
    title: 'Getting Started with Brandscaling',
    requiredTier: 'beginner',
    track: 'all'
  },
  'business-idea-lab': { 
    title: 'Business Idea Lab',
    requiredTier: 'beginner',
    track: 'all'
  },
  'frameworks-101': { 
    title: 'Frameworks 101',
    requiredTier: 'intermediate',
    track: 'architect'
  },
  'foundations': { 
    title: 'Brandscaling Foundations',
    requiredTier: 'intermediate',
    track: 'all'
  },
  'architect-mastery': { 
    title: 'Architect Mastery Program',
    requiredTier: 'advanced',
    track: 'architect'
  },
  'alchemist-intuition': { 
    title: 'Alchemist Intuition Training',
    requiredTier: 'advanced',
    track: 'alchemist'
  },
  'mastermind-mastery': { 
    title: 'Mastermind Mastery',
    requiredTier: 'advanced',
    track: 'all'
  },
  '100k-club-exclusive': { 
    title: '£100K Club Exclusive Strategies',
    requiredTier: 'mastermind',
    track: 'all'
  }
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