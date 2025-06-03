import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, ArrowUp, Crown, CheckCircle, Circle } from 'lucide-react';
import { useAccess } from '@/hooks/useAccess';
import { Link } from 'wouter';

const tierData = {
  beginner: {
    name: 'Beginner',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    next: 'intermediate'
  },
  intermediate: {
    name: 'Intermediate',
    icon: <ArrowUp className="h-5 w-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    next: 'advanced'
  },
  advanced: {
    name: 'Advanced',
    icon: <Crown className="h-5 w-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    next: 'mastermind'
  },
  mastermind: {
    name: 'Mastermind',
    icon: <Crown className="h-5 w-5" />,
    color: 'text-purple-800',
    bgColor: 'bg-gradient-to-r from-purple-100 to-orange-100',
    next: null
  }
};

const allTiers = ['beginner', 'intermediate', 'advanced', 'mastermind'];

export default function YouAreHere() {
  const { userTier, allowedCourses, isLoading } = useAccess();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentTierData = tierData[userTier as keyof typeof tierData];
  const currentIndex = allTiers.indexOf(userTier);

  return (
    <Card className="w-full border-2 border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className={`p-3 rounded-full ${currentTierData?.bgColor}`}>
            <span className={currentTierData?.color}>
              {currentTierData?.icon}
            </span>
          </div>
          You Are Here: {currentTierData?.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <span className="text-sm text-gray-600">Current Tier</span>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-900">Your Journey</h4>
          <div className="space-y-2">
            {allTiers.map((tier, index) => {
              const tierInfo = tierData[tier as keyof typeof tierData];
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isUpcoming = index > currentIndex;
              
              return (
                <div key={tier} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {isCurrent && (
                      <div className={`p-1 rounded-full ${tierInfo.bgColor}`}>
                        <span className={tierInfo.color}>
                          {tierInfo.icon}
                        </span>
                      </div>
                    )}
                    {isUpcoming && (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      isCurrent ? tierInfo.color : 
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {tierInfo.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Courses Available</span>
            <span className="text-sm font-bold text-gray-900">
              {allowedCourses.length > 0 ? allowedCourses.length : 'Loading...'}
            </span>
          </div>
          
          {currentTierData?.next && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">
                Next milestone: Upgrade to {tierData[currentTierData.next as keyof typeof tierData]?.name}
              </p>
              <Link href={`/upgrade?target=${currentTierData.next}`}>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  View Upgrade Options
                </Button>
              </Link>
            </div>
          )}
          
          {userTier === 'mastermind' && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-center text-purple-600 font-medium">
                🎉 You've reached the highest tier!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}