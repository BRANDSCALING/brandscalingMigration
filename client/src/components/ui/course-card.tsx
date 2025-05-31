import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Lock } from "lucide-react";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description?: string;
    track: string;
    level: number;
    imageUrl?: string;
  };
  progress?: {
    progress: number;
    currentModule?: number;
  };
  variant?: "active" | "upcoming" | "locked";
}

export default function CourseCard({ course, progress, variant = "upcoming" }: CourseCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "active":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200";
      case "locked":
        return "bg-slate-50";
      default:
        return "bg-slate-50";
    }
  };

  const getButtonContent = () => {
    switch (variant) {
      case "active":
        return (
          <Button className="bg-white text-primary hover:bg-slate-50">
            Continue
          </Button>
        );
      case "locked":
        return (
          <Button disabled className="text-slate-400">
            <Lock className="w-4 h-4" />
          </Button>
        );
      default:
        return (
          <Button disabled className="text-slate-400">
            <Lock className="w-4 h-4" />
          </Button>
        );
    }
  };

  return (
    <Card className={`${getVariantStyles()} transition-colors`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={course.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=80&h=80&fit=crop"}
            alt={course.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-slate-900">{course.title}</h3>
              {variant === "active" && (
                <Badge className="bg-primary text-white text-xs">In Progress</Badge>
              )}
              {variant === "upcoming" && (
                <Badge variant="secondary" className="text-xs">Next in Queue</Badge>
              )}
              {variant === "locked" && (
                <Badge variant="secondary" className="text-xs">Locked</Badge>
              )}
            </div>
            {course.description && (
              <p className="text-sm text-slate-600 mb-2 line-clamp-1">{course.description}</p>
            )}
            {progress && progress.progress > 0 && (
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex-1 bg-white rounded-full h-2">
                  <Progress value={progress.progress * 100} className="h-2" />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {Math.round(progress.progress * 100)}%
                </span>
              </div>
            )}
            {progress?.currentModule && (
              <p className="text-xs text-slate-600">Module {progress.currentModule}</p>
            )}
          </div>
          {getButtonContent()}
        </div>
      </CardContent>
    </Card>
  );
}
