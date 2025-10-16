"use client";

import Navbar from "@/components/navbar";

export default function BlogHomepage() {
  const featuredPost = {
    category: "Technology",
    title: "The Future of Web Development in 2025",
    excerpt: "Discover the latest trends shaping how we build for the web, from AI-powered tools to new frameworks that are revolutionizing the development experience.",
    author: "Sarah Chen",
    date: "October 15, 2025",
    readTime: "8 min read"
  };

  const posts = [
    {
      category: "Design",
      title: "Mastering Minimalist Design",
      excerpt: "Learn the principles behind creating beautiful, functional interfaces with less.",
      readTime: "5 min read",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      category: "Lifestyle",
      title: "Finding Balance in a Digital World",
      excerpt: "Practical strategies for maintaining wellness while staying connected.",
      readTime: "7 min read",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      category: "Business",
      title: "Building Sustainable Startups",
      excerpt: "Key insights from founders who prioritized long-term growth over quick wins.",
      readTime: "10 min read",
      gradient: "from-green-400 to-cyan-400"
    },
    {
      category: "Travel",
      title: "Hidden Gems of Southeast Asia",
      excerpt: "Explore breathtaking destinations off the beaten path.",
      readTime: "6 min read",
      gradient: "from-pink-400 to-yellow-400"
    },
    {
      category: "Technology",
      title: "AI and Creative Expression",
      excerpt: "How artificial intelligence is transforming the creative industries.",
      readTime: "9 min read",
      gradient: "from-cyan-600 to-indigo-900"
    },
    {
      category: "Food",
      title: "The Art of Slow Cooking",
      excerpt: "Rediscovering traditional techniques for modern kitchens.",
      readTime: "4 min read",
      gradient: "from-teal-300 to-pink-300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
          Welcome to ThoughtSpace
        </h1>
        <p className="text-xl md:text-2xl opacity-95">
          Exploring ideas, stories, and insights that matter
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className={`h-48 bg-gradient-to-br ${post.gradient}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 mt-16">
        <p>&copy; 2025 ThoughtSpace. All rights reserved.</p>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease;
        }
      `}</style>
    </div>
  );
}