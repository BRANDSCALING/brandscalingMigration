import Header from "@/components/Header";
import Footer from "@/components/Footer";

const blogPosts = [
  {
    title: "🧠 The Idea-Stuck Phase: How to Get Unblocked and Moving",
    description: "Before strategy or scaling—clarity. Here's how Brandscaling helps turn loops into launch.",
    date: "May 2025",
    tag: "Startup",
    color: "#841477", // Deep Plum
  },
  {
    title: "🎯 90 Days to Scale: Systems That Free You (Not Trap You)",
    description: "Most business owners are buried in their systems. Let's build ones that release you.",
    date: "May 2025",
    tag: "ScaleUp",
    color: "#F6782F", // Scale Orange
  },
  {
    title: "📢 Architect Thinking: Precision for Business Brains",
    description: "If your power is logic, planning, and systems, here's how we sharpen that edge.",
    date: "May 2025",
    tag: "Architect",
    color: "#42047D", // Architect Indigo
  },
  {
    title: "📱 Alchemist Moves: When Intuition Beats a Strategy Deck",
    description: "When your energy *is* the strategy—here's how to turn it into scale, not burnout.",
    date: "May 2025",
    tag: "Alchemist",
    color: "#EC4049", // Founder Red
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="font-poppins">
        <div className="px-6 py-16 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#42047D] mb-2">📚 Brandscaling Blog</h1>
          <p className="text-lg text-gray-700 mb-10">Insights for business minds who refuse basic. Built for scale, not just theory.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-lg p-6 shadow-md hover:shadow-lg transition"
              >
                <span
                  className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ backgroundColor: post.color }}
                >
                  {post.tag}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-3">{post.description}</p>
                <p className="text-sm text-gray-400">{post.date}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}