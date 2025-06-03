import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAccess() {
  const { data: accessData, isLoading } = useQuery({
    queryKey: ["/api/access/courses"],
    retry: false,
  });

  return {
    userTier: accessData?.userTier || 'beginner',
    allowedCourses: accessData?.allowedCourses || [],
    allCourses: accessData?.allCourses || [],
    isLoading
  };
}

export function useCourseAccess(courseId: string) {
  const { data: courseAccess, isLoading } = useQuery({
    queryKey: ["/api/access/course", courseId],
    enabled: !!courseId,
    retry: false,
  });

  return {
    hasAccess: courseAccess?.hasAccess || false,
    currentTier: courseAccess?.currentTier || 'beginner',
    requiredTier: courseAccess?.requiredTier,
    upgradeTarget: courseAccess?.upgradeTarget,
    upgradeUrl: courseAccess?.upgradeUrl,
    course: courseAccess?.course,
    isLoading
  };
}

export function useFeatureAccess(feature: string) {
  const { data: featureAccess, isLoading } = useQuery({
    queryKey: ["/api/access/feature", feature],
    enabled: !!feature,
    retry: false,
  });

  return {
    hasAccess: featureAccess?.hasAccess || false,
    currentTier: featureAccess?.currentTier || 'beginner',
    requiredTier: featureAccess?.requiredTier,
    upgradeUrl: featureAccess?.upgradeUrl,
    isLoading
  };
}