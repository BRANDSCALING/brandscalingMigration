import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";

interface CommunityPostProps {
  post: {
    id: number;
    title?: string;
    content: string;
    likes: number;
    replies: number;
    createdAt: string;
    user: {
      id: string;
      firstName?: string;
      email?: string;
      profileImageUrl?: string;
      role: string;
    };
  };
  onLike?: (postId: number) => void;
}

export default function CommunityPost({ post, onLike }: CommunityPostProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "mastermind":
        return "text-emerald-600 bg-emerald-100";
      case "admin":
        return "text-purple-600 bg-purple-100";
      case "buyer":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "mastermind":
        return "Mastermind";
      case "admin":
        return "Admin";
      case "buyer":
        return "Member";
      default:
        return "Guest";
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-slate-50 rounded-lg transition-colors">
      <img
        src={post.user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=40&h=40&fit=crop&crop=face`}
        alt={`${post.user.firstName || 'User'} avatar`}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium text-slate-900">
            {post.user.firstName || post.user.email?.split("@")[0] || "Anonymous"}
          </h4>
          <Badge variant="secondary" className={getRoleBadgeColor(post.user.role)}>
            {getRoleLabel(post.user.role)}
          </Badge>
          <span className="text-xs text-slate-500">{timeAgo(post.createdAt)}</span>
        </div>
        
        {post.title && (
          <h3 className="font-semibold text-slate-900 mb-1">{post.title}</h3>
        )}
        
        <p className="text-sm text-slate-700 mb-2 whitespace-pre-wrap line-clamp-3">
          {post.content}
        </p>
        
        <div className="flex items-center space-x-4 text-xs text-slate-500">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:text-red-500 transition-colors"
            onClick={() => onLike?.(post.id)}
          >
            <Heart className="w-4 h-4 mr-1" />
            {post.likes} likes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:text-primary transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            {post.replies} replies
          </Button>
        </div>
      </div>
    </div>
  );
}
