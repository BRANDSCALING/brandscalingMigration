import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  Clock,
  User,
  TrendingUp,
  Target,
  Users,
  Lightbulb,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Complete Guide to Brand Positioning in 2024",
    excerpt: "Discover how to position your brand effectively in today's competitive marketplace with proven strategies and real-world examples.",
    content: "Brand positioning is the foundation of all successful marketing efforts...",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b330?ixlib=rb-4.0.3&w=40&h=40&fit=crop&crop=face",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    category: "Strategy",
    tags: ["brand positioning", "strategy", "marketing"],
    featured: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=600&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Building Community Around Your Brand: A Step-by-Step Guide",
    excerpt: "Learn how to create an engaged community that drives brand loyalty and sustainable growth for your business.",
    content: "Community building has become essential for modern brands...",
    author: "Marcus Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=40&h=40&fit=crop&crop=face",
    publishedAt: "2024-01-12",
    readTime: "6 min read",
    category: "Community",
    tags: ["community", "engagement", "growth"],
    featured: false,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&w=600&h=300&fit=crop",
  },
  {
    id: "3",
    title: "AI-Powered Brand Strategy: The Future is Now",
    excerpt: "Explore how artificial intelligence is revolutionizing brand strategy and how you can leverage AI tools for your brand.",
    content: "Artificial intelligence is transforming how we approach brand strategy...",
    author: "Alex Thompson",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=40&h=40&fit=crop&crop=face",
    publishedAt: "2024-01-10",
    readTime: "10 min read",
    category: "Technology",
    tags: ["AI", "strategy", "innovation"],
    featured: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=600&h=300&fit=crop",
  },
  {
    id: "4",
    title: "From Startup to Scale: Lessons from 100+ Brand Success Stories",
    excerpt: "Key insights and patterns from analyzing over 100 successful brand transformations in our community.",
    content: "After working with hundreds of entrepreneurs, we've identified key patterns...",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b330?ixlib=rb-4.0.3&w=40&h=40&fit=crop&crop=face",
    publishedAt: "2024-01-08",
    readTime: "12 min read",
    category: "Case Studies",
    tags: ["case studies", "growth", "scaling"],
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=600&h=300&fit=crop",
  },
  {
    id: "5",
    title: "The Psychology of Brand Loyalty: What Makes Customers Stick",
    excerpt: "Understanding the psychological triggers that create lasting brand loyalty and how to implement them in your strategy.",
    content: "Brand loyalty isn't just about great products or services...",
    author: "Marcus Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=40&h=40&fit=crop&crop=face",
    publishedAt: "2024-01-05",
    readTime: "7 min read",
    category: "Psychology",
    tags: ["psychology", "loyalty", "customer retention"],
    featured: false,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&w=600&h=300&fit=crop",
  },
];

const categories = ["All", "Strategy", "Community", "Technology", "Case Studies", "Psychology"];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Strategy": return Target;
      case "Community": return Users;
      case "Technology": return Lightbulb;
      case "Case Studies": return TrendingUp;
      case "Psychology": return User;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Strategy": return "bg-blue-100 text-blue-700";
      case "Community": return "bg-emerald-100 text-emerald-700";
      case "Technology": return "bg-purple-100 text-purple-700";
      case "Case Studies": return "bg-amber-100 text-amber-700";
      case "Psychology": return "bg-pink-100 text-pink-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Brand Building Insights
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Expert strategies, case studies, and actionable insights to help you build and scale your brand
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search articles..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Posts */}
      {searchTerm === "" && selectedCategory === "All" && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(post.category)}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <img
                            src={post.authorImage}
                            alt={post.author}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="link" className="p-0 text-primary">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-8">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => {
                  const CategoryIcon = getCategoryIcon(post.category);
                  return (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getCategoryColor(post.category)}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                          <div className="flex items-center space-x-2">
                            <img
                              src={post.authorImage}
                              alt={post.author}
                              className="w-5 h-5 rounded-full"
                            />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button variant="link" className="p-0 text-primary">
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No articles found</h3>
                <p className="text-slate-600">
                  {searchTerm ? `No articles match "${searchTerm}"` : `No articles in ${category} category`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Newsletter CTA */}
      <Card className="bg-gradient-to-r from-primary to-blue-600 text-white mt-16">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-6">
            Get the latest brand building insights delivered to your inbox weekly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="bg-white text-slate-900"
            />
            <Button className="bg-white text-primary hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
