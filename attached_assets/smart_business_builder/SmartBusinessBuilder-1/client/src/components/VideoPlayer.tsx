import { Play, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoPlayerProps {
  title: string;
  instructor: string;
  description: string;
  duration: string;
  imageUrl: string;
  tags: string[];
  colorScheme: "architect" | "alchemist";
  onPlay?: () => void;
  isCompleted?: boolean;
}

export function VideoPlayer({
  title,
  instructor,
  description,
  duration,
  imageUrl,
  tags,
  colorScheme,
  onPlay,
  isCompleted = false
}: VideoPlayerProps) {
  const colorClasses = {
    architect: {
      title: "text-architect-indigo",
      tagBg: "bg-architect-indigo/10 text-architect-indigo",
      accentColor: "architect-indigo"
    },
    alchemist: {
      title: "text-scale-orange",
      tagBg: "bg-scale-orange/10 text-scale-orange",
      accentColor: "scale-orange"
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div 
        className="aspect-video bg-gray-900 relative group cursor-pointer"
        onClick={onPlay}
      >
        <img 
          src={imageUrl}
          alt={`${instructor} - Business Expert`}
          className="w-full h-full object-cover"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Play className="w-6 h-6 text-gray-700 ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {duration}
        </div>

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Completed
          </div>
        )}
      </div>
      
      {/* Video Information */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-xl font-bold ${colors.title}`}>
            {title}: {instructor}
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 ${isCompleted ? 'bg-green-500' : 'bg-green-500 animate-pulse'} rounded-full`}></div>
            <span className="text-sm text-gray-500">
              {isCompleted ? 'Completed' : 'Ready'}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={`${colors.tagBg} rounded-full text-sm font-medium`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
