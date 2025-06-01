import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Plus, MessageCircle, Search, Filter, ArrowLeft, MoreVertical, Pin, Star, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { Link } from "wouter";
import type { Post, User } from "@shared/schema";

type CommunityPost = Post & { user: User };

export default function StudentCommunity() {
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdminDeleteDialogOpen, setIsAdminDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<CommunityPost | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [undoTimeouts, setUndoTimeouts] = useState<Record<string, number>>({});

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Helper function to check if undo is available
  const getUndoStatus = (createdAt: string) => {
    const createdTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const elapsed = currentTime - createdTime;
    const remaining = Math.max(0, 60000 - elapsed);
    const timeLeft = Math.ceil(remaining / 1000);
    return { timeLeft, isActive: remaining > 0 };
  };

  // Fetch community posts
  const { data: postsData, isLoading, refetch } = useQuery<CommunityPost[]>({
    queryKey: ["/api/community/posts"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/community/posts");
      return await response.json();
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache the response
  });

  // Ensure posts is always an array
  const posts = Array.isArray(postsData) ? postsData : [];

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
      
      const postData = await newPost.json();
      
      // Show undo toast notification
      toast({
        title: "✅ Post Shared",
        description: "Your post has been shared with the community!",
        action: (
          <button
            onClick={() => handleUndoPost(postData.id)}
            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Undo
          </button>
        ),
        duration: 60000, // 60 seconds
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

  // Undo post mutation
  const undoPostMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("DELETE", `/api/community/posts/${postId}/undo`),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "🗑️ Post removed — you can repost any time.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to undo post. The 60-second window may have expired.",
        variant: "destructive",
      });
    },
  });

  // Edit post mutation
  const editPostMutation = useMutation({
    mutationFn: async (data: { postId: string; title: string; body: string; tags?: string[] }) => {
      const response = await apiRequest("PUT", `/api/community/posts/${data.postId}`, {
        title: data.title,
        body: data.body,
        tags: data.tags,
      });
      return await response.json();
    },
    onSuccess: async () => {
      await refetch();
      setIsEditDialogOpen(false);
      setEditingPost(null);
      setNewPost({ title: "", body: "", tags: [] });
      setTagInput("");
      toast({
        title: "Post Updated",
        description: "Your post has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Admin delete post mutation
  const adminDeleteMutation = useMutation({
    mutationFn: async ({ postId, reason }: { postId: string; reason: string }) => {
      await apiRequest("DELETE", `/api/community/posts/${postId}/admin-delete`, { reason });
    },
    onSuccess: async () => {
      await refetch();
      setIsAdminDeleteDialogOpen(false);
      setDeletingPost(null);
      setDeleteReason("");
      toast({
        title: "Post Deleted",
        description: "Post has been removed by admin",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  // Pin post mutation
  const pinPostMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("POST", `/api/community/posts/${postId}/pin`),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Post Pinned",
        description: "Post has been pinned to the top",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to pin post",
        variant: "destructive",
      });
    },
  });

  // Unpin post mutation
  const unpinPostMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("DELETE", `/api/community/posts/${postId}/pin`),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Post Unpinned",
        description: "Post has been unpinned",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unpin post",
        variant: "destructive",
      });
    },
  });

  // Feature post mutation
  const featurePostMutation = useMutation({
    mutationFn: ({ postId, featuredType }: { postId: string; featuredType: string }) => 
      apiRequest("POST", `/api/community/posts/${postId}/featured`, { featuredType }),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Post Featured",
        description: "Post has been featured as an announcement",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to feature post",
        variant: "destructive",
      });
    },
  });

  // Unfeature post mutation
  const unfeaturePostMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("DELETE", `/api/community/posts/${postId}/featured`),
    onSuccess: async () => {
      await refetch();
      toast({
        title: "Post Unfeatured",
        description: "Post is no longer featured",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unfeature post",
        variant: "destructive",
      });
    },
  });

  const handleUndoPost = (postId: string) => {
    undoPostMutation.mutate(postId);
  };

  const handleAdminDeletePost = (post: CommunityPost) => {
    setDeletingPost(post);
    setIsAdminDeleteDialogOpen(true);
  };

  const handleEditPost = (post: CommunityPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      body: post.body,
      tags: post.tags || [],
    });
    setTagInput("");
    setIsEditDialogOpen(true);
  };

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

  const handleEditSubmit = async () => {
    if (!editingPost || !newPost.title.trim() || !newPost.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    editPostMutation.mutate({
      postId: editingPost.id,
      title: newPost.title.trim(),
      body: newPost.body.trim(),
      tags: newPost.tags.filter(tag => tag.trim() !== ""),
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
          <p className="text-gray-600">Connect, share, and learn with fellow students.</p>
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

      {/* Featured Announcements */}
      {posts && posts.filter(post => post.featuredType).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-900">Featured Announcements</h3>
          {posts
            .filter(post => post.featuredType)
            .map((post) => {
              const getFeaturedIcon = (type: string) => {
                switch (type) {
                  case 'launch': return '🎉';
                  case 'update': return '📢';
                  case 'tip': return '🧠';
                  case 'warning': return '⚠️';
                  case 'direction': return '🧭';
                  default: return '📌';
                }
              };

              const getFeaturedColor = (type: string) => {
                switch (type) {
                  case 'launch': return 'bg-green-50 border-green-200 text-green-800';
                  case 'update': return 'bg-blue-50 border-blue-200 text-blue-800';
                  case 'tip': return 'bg-purple-50 border-purple-200 text-purple-800';
                  case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
                  case 'direction': return 'bg-indigo-50 border-indigo-200 text-indigo-800';
                  default: return 'bg-gray-50 border-gray-200 text-gray-800';
                }
              };

              return (
                <Card key={post.id} className={`border-2 ${getFeaturedColor(post.featuredType || '')}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getFeaturedIcon(post.featuredType || '')}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                        <p className="mb-3">{post.body}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.user.profileImageUrl || undefined} />
                              <AvatarFallback className="text-xs">
                                {post.user.firstName?.[0] || post.user.email?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span>{post.user.firstName || post.user.email}</span>
                            {(post.user.role === 'admin' || post.user.role === 'staff') && (
                              <Badge variant="default" className="text-xs bg-purple-600">
                                {post.user.role === 'admin' ? 'Admin' : 'Staff'}
                              </Badge>
                            )}
                          </div>
                          {(user?.role === 'admin' || user?.role === 'staff') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => unfeaturePostMutation.mutate(post.id)}
                              disabled={unfeaturePostMutation.isPending}
                            >
                              Remove Featured
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Pinned Posts */}
      {posts && posts.filter(post => post.isPinned && !post.featuredType).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-900">📌 Pinned Posts</h3>
          {posts
            .filter(post => post.isPinned && !post.featuredType)
            .map((post) => (
              <Card key={post.id} className="border-l-4 border-l-blue-500 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                      <p className="text-gray-700 mb-3">{post.body}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.user.profileImageUrl || undefined} />
                          <AvatarFallback className="text-xs">
                            {post.user.firstName?.[0] || post.user.email?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.user.firstName || post.user.email}</span>
                        {(post.user.role === 'admin' || post.user.role === 'staff') && (
                          <Badge variant="default" className="text-xs bg-purple-600">
                            {post.user.role === 'admin' ? 'Admin' : 'Staff'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {(user?.role === 'admin' || user?.role === 'staff') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unpinPostMutation.mutate(post.id)}
                        disabled={unpinPostMutation.isPending}
                      >
                        Unpin
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Regular Posts List */}
      <div className="space-y-4">
        {filteredPosts.filter(post => !post.featuredType && !post.isPinned).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet — start the conversation!</h3>
              <p className="text-gray-600">Be the first to share something with the community.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => {
            const isAuthor = user && post.userId === user.id;
            const createdTime = new Date(post.createdAt);
            const updatedTime = post.updatedAt ? new Date(post.updatedAt) : null;
            const isEdited = updatedTime && updatedTime.getTime() !== createdTime.getTime();
            const undoStatus = getUndoStatus(post.createdAt);

            return (
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
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>
                            {post.user.firstName || post.user.email}
                            {post.createdAt && ` • ${createdTime.toLocaleDateString()}`}
                          </span>
                          {/* Admin/Staff Badge */}
                          {(post.user.role === 'admin' || post.user.role === 'staff') && (
                            <Badge variant="default" className="text-xs bg-purple-600 hover:bg-purple-700">
                              {post.user.role === 'admin' ? 'Admin' : 'Staff'}
                            </Badge>
                          )}
                          {isEdited && (
                            <span 
                              className="text-xs text-gray-500 cursor-help"
                              title={`Last edited at ${updatedTime?.toLocaleString()}`}
                            >
                              (edited)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isAuthor && undoStatus.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Undo: {undoStatus.timeLeft}s
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{post.body}</p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => setSelectedTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Show edit/undo controls only for post author */}
                      {isAuthor && (
                        <>
                          {/* Show undo button only within 60 seconds of creation */}
                          {undoStatus.isActive && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleUndoPost(post.id)}
                              disabled={undoPostMutation.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              Undo Post ({undoStatus.timeLeft}s)
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditPost(post)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Edit Post
                          </Button>
                        </>
                      )}
                      
                      {/* Admin moderation controls */}
                      {(user?.role === 'admin' || user?.role === 'staff') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!post.isPinned && (
                              <DropdownMenuItem onClick={() => pinPostMutation.mutate(post.id)}>
                                <Pin className="h-4 w-4 mr-2" />
                                Pin Post
                              </DropdownMenuItem>
                            )}
                            {post.isPinned && (
                              <DropdownMenuItem onClick={() => unpinPostMutation.mutate(post.id)}>
                                <Pin className="h-4 w-4 mr-2" />
                                Unpin Post
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => featurePostMutation.mutate({ postId: post.id, featuredType: 'update' })}>
                              <Star className="h-4 w-4 mr-2" />
                              Feature as Update
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => featurePostMutation.mutate({ postId: post.id, featuredType: 'tip' })}>
                              <Star className="h-4 w-4 mr-2" />
                              Feature as Tip
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => featurePostMutation.mutate({ postId: post.id, featuredType: 'warning' })}>
                              <Star className="h-4 w-4 mr-2" />
                              Feature as Warning
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleAdminDeletePost(post)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update your post content and tags.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Post Title</Label>
              <Input
                id="edit-title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter post title"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="edit-body">What would you like to share or ask?</Label>
              <Textarea
                id="edit-body"
                value={newPost.body}
                onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Share your thoughts, questions, or insights..."
                className="w-full min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="edit-tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {newPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newPost.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setNewPost(prev => ({
                        ...prev,
                        tags: prev.tags.filter((_, i) => i !== index)
                      }))}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingPost(null);
                setNewPost({ title: "", body: "", tags: [] });
                setTagInput("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEditSubmit}
              disabled={editPostMutation.isPending}
            >
              {editPostMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Delete Confirmation Dialog */}
      <Dialog open={isAdminDeleteDialogOpen} onOpenChange={setIsAdminDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Post (Admin)</DialogTitle>
            <DialogDescription>
              This action will permanently delete the post. Please provide a reason for moderation logging.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {deletingPost && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-sm">{deletingPost.title}</p>
                <p className="text-xs text-gray-600">by {deletingPost.user.firstName || deletingPost.user.email}</p>
              </div>
            )}
            <div>
              <Label htmlFor="delete-reason">Reason for deletion</Label>
              <Textarea
                id="delete-reason"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Please explain why this post is being removed..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAdminDeleteDialogOpen(false);
                setDeletingPost(null);
                setDeleteReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (deletingPost && deleteReason.trim()) {
                  adminDeleteMutation.mutate({ 
                    postId: deletingPost.id, 
                    reason: deleteReason.trim() 
                  });
                }
              }}
              disabled={adminDeleteMutation.isPending || !deleteReason.trim()}
            >
              {adminDeleteMutation.isPending ? "Deleting..." : "Delete Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}