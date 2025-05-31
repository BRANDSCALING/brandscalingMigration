import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Calendar, TrendingUp, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Tag color mapping for consistency
const getTagColor = (tags: string) => {
  if (tags?.toLowerCase().includes('startup')) return "#841477"; // Deep Plum
  if (tags?.toLowerCase().includes('scaleup')) return "#F6782F"; // Scale Orange
  if (tags?.toLowerCase().includes('architect')) return "#42047D"; // Architect Indigo
  if (tags?.toLowerCase().includes('alchemist')) return "#EC4049"; // Founder Red
  return "#6B7280"; // Default gray
};

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string;
  status: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["/api/blog-posts/published"],
  });

  // Extract unique tags from all posts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    (blogPosts as BlogPost[]).forEach(post => {
      if (post.tags) {
        post.tags.split(',').forEach(tag => {
          tagSet.add(tag.trim().toLowerCase());
        });
      }
    });
    return Array.from(tagSet);
  }, [blogPosts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...(blogPosts as BlogPost[])];

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        post.tags?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        post.summary?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags?.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // For now, popular = recent (you could add view count later)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [blogPosts, debouncedSearch, selectedTag, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="font-poppins">
          <div className="px-6 py-16 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-[#42047D] mb-2">📚 Brandscaling Blog</h1>
            <p className="text-lg text-gray-700 mb-10">Insights for business minds who refuse basic. Built for scale, not just theory.</p>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border rounded-lg p-6 shadow-md">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="font-poppins">
        <div className="px-6 py-16 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#42047D] mb-2">📚 Brandscaling Blog</h1>
          <p className="text-lg text-gray-700 mb-8">Insights for business minds who refuse basic. Built for scale, not just theory.</p>

          {/* Search and Filter Controls */}
          <div className="space-y-6 mb-10">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={sortBy === "recent" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("recent")}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Recent
                </Button>
                <Button
                  variant={sortBy === "popular" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("popular")}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Popular
                </Button>
              </div>

              {/* Tag Filter Badges */}
              {availableTags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Filter by:</span>
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer hover:bg-gray-100 capitalize"
                      style={{
                        backgroundColor: selectedTag === tag ? getTagColor(tag) : 'transparent',
                        borderColor: getTagColor(tag),
                        color: selectedTag === tag ? 'white' : getTagColor(tag)
                      }}
                      onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {selectedTag && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTag("")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Active Filters Summary */}
            {(searchTerm || selectedTag) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Showing {filteredPosts.length} results</span>
                {searchTerm && <span>for "{searchTerm}"</span>}
                {selectedTag && <span>in "{selectedTag}"</span>}
              </div>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📝</span>
              </div>
              {(blogPosts as BlogPost[]).length === 0 ? (
                <>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Blog Posts Yet</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Blog posts will appear here once they are published. Check back soon for insights and strategies.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Posts Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-4">
                    No posts match your current search and filter criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTag("");
                    }}
                  >
                    Clear all filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border rounded-lg p-6 shadow-md hover:shadow-lg transition"
                >
                  {post.tags && (
                    <span
                      className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
                      style={{ backgroundColor: getTagColor(post.tags) }}
                    >
                      {post.tags.split(',')[0]?.trim() || 'General'}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-3">{post.summary || "Click to read more..."}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                    {post.author && (
                      <p className="text-sm text-gray-500">
                        By {post.author.firstName} {post.author.lastName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}