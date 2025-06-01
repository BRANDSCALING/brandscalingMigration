import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, MessageCircle, Search, Filter, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { Link } from "wouter";
import type { Post, User } from "@shared/schema";

type CommunityPost = Post & { user: User };

export default function StudentCommunity() {
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch community posts
  const { data: postsData, isLoading, refetch } = useQuery<CommunityPost[]>({
    queryKey: ["/api/community/posts"],
    queryFn: () => apiRequest("GET", "/api/community/posts"),
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the response
  });

  // Ensure posts is always an array
  const posts = Array.isArray(postsData) ? postsData : [];
  
  console.log("Posts data:", postsData);
  console.log("Filtered posts:", posts);

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (postData: { title: string; body: string; tags?: string[] }) =>
      apiRequest("POST", "/api/community/posts", postData),
    onSuccess: async (newPost) => {
      // Use the direct refetch function from the query
      await refetch();
      
      setIsCreateDialogOpen(false);
      setNewPost({ title: "", body: "", tags: [] });
      setTagInput("");
      toast({
        title: "✅ Post Shared",
        description: "Your post has been shared with the community!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = async () => {
    console.log("Form data:", { title: newPost.title, body: newPost.body });
    console.log("Firebase user:", auth.currentUser);
    
    if (!newPost.title.trim() || !newPost.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!auth.currentUser) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      title: newPost.title,
      body: newPost.body,
      tags: newPost.tags.length > 0 ? newPost.tags : undefined,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Filter posts based on search term and selected tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === "" || (post.tags && post.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  // Get unique tags from all posts
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Return to Dashboard Link */}
      <div className="mb-4">
        <Link href="/student">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brandscaling Community</h1>
          <p className="text-gray-600">AWAITING USER CONTENT</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>Share your insights, questions, or updates with the community.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Struggling to hire my first VA…"
                />
              </div>
              
              <div>
                <Label htmlFor="body">What would you like to share or ask?</Label>
                <Textarea
                  id="body"
                  value={newPost.body}
                  onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Explain your insight, question, or update…"
                  rows={6}
                />
              </div>

              <div>
                <Label>Select Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. win, feedback, stuck, automation"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newPost.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePost}
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? "Sharing..." : "Share to Community"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="">Filter by tag</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet — start the conversation!</h3>
              <p className="text-gray-600">AWAITING USER CONTENT</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {post.user.firstName?.[0] || post.user.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <p className="text-sm text-gray-600">
                        AWAITING USER CONTENT {post.user.firstName || post.user.email}
                        {post.createdAt && ` • ${new Date(post.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.body}</p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    AWAITING USER CONTENT
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}