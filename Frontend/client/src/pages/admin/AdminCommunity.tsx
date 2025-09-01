import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, EyeOff, Pin, PinOff, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  body: string;
  userId: string;
  tags: string[];
  uploadUrls: string[];
  isPinned: boolean;
  isHidden: boolean;
  visibilityTier: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    accessTier: string;
    profileImageUrl?: string;
  };
}

interface PostReply {
  id: string;
  postId: string;
  userId: string;
  body: string;
  isHidden: boolean;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    accessTier: string;
  };
}

export default function AdminCommunity() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    visibilityTier: "beginner",
    tags: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch posts with filters
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/admin/community/posts", filterTier, filterStatus],
  });

  // Fetch replies for selected post
  const { data: replies = [] } = useQuery({
    queryKey: ["/api/admin/community/posts", selectedPost?.id, "replies"],
    enabled: !!selectedPost,
  });

  // Create announcement post
  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const response = await apiRequest("POST", "/api/admin/community/posts", {
        ...postData,
        tags: postData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/community/posts"] });
      setIsCreatePostOpen(false);
      setNewPost({ title: "", body: "", visibilityTier: "beginner", tags: "" });
      toast({ title: "Announcement post created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create post", variant: "destructive" });
    },
  });

  // Toggle post pin
  const togglePinMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiRequest("PUT", `/api/admin/community/posts/${postId}/pin`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/community/posts"] });
      toast({ title: "Post pin status updated" });
    },
  });

  // Toggle post visibility
  const toggleVisibilityMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiRequest("PUT", `/api/admin/community/posts/${postId}/visibility`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/community/posts"] });
      toast({ title: "Post visibility updated" });
    },
  });

  // Delete post
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await apiRequest("DELETE", `/api/admin/community/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/community/posts"] });
      toast({ title: "Post deleted successfully" });
    },
  });

  // Toggle reply visibility
  const toggleReplyVisibilityMutation = useMutation({
    mutationFn: async (replyId: string) => {
      const response = await apiRequest("PUT", `/api/admin/community/replies/${replyId}/visibility`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/community/posts", selectedPost?.id, "replies"] });
      toast({ title: "Reply visibility updated" });
    },
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-blue-100 text-blue-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "mastermind": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserDisplayName = (user: Post["user"]) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Community Management</h1>
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Admin Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Announcement Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <Textarea
                placeholder="Announcement Content"
                value={newPost.body}
                onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                rows={4}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  value={newPost.visibilityTier} 
                  onValueChange={(value) => setNewPost({ ...newPost, visibilityTier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Visibility Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner+</SelectItem>
                    <SelectItem value="intermediate">Intermediate+</SelectItem>
                    <SelectItem value="advanced">Advanced+</SelectItem>
                    <SelectItem value="mastermind">Mastermind Only</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Tags (comma-separated)"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => createPostMutation.mutate(newPost)}
                  disabled={createPostMutation.isPending}
                >
                  Create Announcement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="mastermind">Mastermind</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="pinned">Pinned Only</SelectItem>
                <SelectItem value="hidden">Hidden Only</SelectItem>
                <SelectItem value="visible">Visible Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="grid gap-4">
        {posts.map((post: Post) => (
          <Card key={post.id} className={`${post.isPinned ? "border-yellow-300 bg-yellow-50" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getUserDisplayName(post.user).charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{getUserDisplayName(post.user)}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTierColor(post.user.accessTier)}>
                          {post.user.accessTier}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-gray-600 mt-1">{post.body}</p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getTierColor(post.visibilityTier)}>
                      Visible to {post.visibilityTier}+
                    </Badge>
                    {post.isPinned && (
                      <Badge className="bg-yellow-100 text-yellow-800">Pinned</Badge>
                    )}
                    {post.isHidden && (
                      <Badge className="bg-red-100 text-red-800">Hidden</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePinMutation.mutate(post.id)}
                  >
                    {post.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleVisibilityMutation.mutate(post.id)}
                  >
                    {post.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPost(post)}
                  >
                    View Replies
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePostMutation.mutate(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Replies Dialog */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Replies to: {selectedPost.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {replies.map((reply: PostReply) => (
                <Card key={reply.id} className={reply.isHidden ? "opacity-50" : ""}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {getUserDisplayName(reply.user).charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{getUserDisplayName(reply.user)}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getTierColor(reply.user.accessTier)}>
                              {reply.user.accessTier}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleReplyVisibilityMutation.mutate(reply.id)}
                      >
                        {reply.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-gray-700">{reply.body}</p>
                  </CardContent>
                </Card>
              ))}
              {replies.length === 0 && (
                <p className="text-gray-500 text-center py-8">No replies yet</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}