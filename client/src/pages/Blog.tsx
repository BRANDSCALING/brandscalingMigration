import { useQuery } from "@tanstack/react-query";
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

export default function Blog() {
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["/api/blog-posts/published"],
  });

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
          <p className="text-lg text-gray-700 mb-10">Insights for business minds who refuse basic. Built for scale, not just theory.</p>

          {blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Blog Posts Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Blog posts will appear here once they are published. Check back soon for insights and strategies.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post: any) => (
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