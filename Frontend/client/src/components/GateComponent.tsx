import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowUp, Crown, Zap } from 'lucide-react';
import { useCourseAccess } from '@/hooks/useAccess';

interface GateComponentProps {
  courseId: string;
  children: React.ReactNode;
  showPreview?: boolean;
}

const tierIcons = {
  beginner: <Zap className="h-5 w-5" />,
  intermediate: <ArrowUp className="h-5 w-5" />,
  advanced: <Crown className="h-5 w-5" />,
  mastermind: <Crown className="h-5 w-5 text-purple-600" />
};

const tierColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-purple-100 text-purple-800 border-purple-200',
  mastermind: 'bg-gradient-to-r from-purple-100 to-orange-100 text-purple-800 border-purple-200'
};

export default function GateComponent({ courseId, children, showPreview = true }: GateComponentProps) {
  const { hasAccess, currentTier, requiredTier, upgradeTarget, upgradeUrl, course, isLoading } = useCourseAccess(courseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {showPreview && (
        <div className="relative">
          <div className="filter blur-sm pointer-events-none opacity-30">
            {children}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
      )}
      
      <Card className="mt-6 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-purple-50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Upgrade Required
          </CardTitle>
          <p className="text-gray-600">
            This content requires {upgradeTarget} tier access
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {course && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${tierColors[currentTier as keyof typeof tierColors]}`}>
                  {tierIcons[currentTier as keyof typeof tierIcons]}
                  Your Tier: {currentTier}
                </div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${tierColors[requiredTier as keyof typeof tierColors]}`}>
                  {tierIcons[requiredTier as keyof typeof tierIcons]}
                  Required: {requiredTier}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold mb-3">What you'll unlock with {upgradeTarget}:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {upgradeTarget === 'intermediate' && (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Advanced frameworks and strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Exclusive architect or alchemist content
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Priority community support
                  </li>
                </>
              )}
              {upgradeTarget === 'advanced' && (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    All courses and masterclasses
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    1:1 strategy day booking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Live events and workshops
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    AI business agents access
                  </li>
                </>
              )}
              {upgradeTarget === 'mastermind' && (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full" />
                    Everything in Advanced tier
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full" />
                    Exclusive mastermind community
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full" />
                    Direct founder access
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full" />
                    Priority feature requests
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {upgradeUrl && (
              <Link href={upgradeUrl} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white">
                  Upgrade to {upgradeTarget}
                </Button>
              </Link>
            )}
            <Link href="/courses" className="flex-1">
              <Button variant="outline" className="w-full">
                Browse Free Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}