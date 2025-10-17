"use client";

import Navbar from "@/components/navbar";
import { useEffect, useEffectEvent, useState } from "react";
import useAuth from "@/hooks/authHook";
import { toast } from "sonner";
import axios from "axios";

export default function BlogHomepage() {



  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const [posts, setPosts] = useState([]);

  const gradients = ["from-pink-500 to-rose-500", "from-indigo-500 to-purple-500", "from-green-400 to-blue-500", "from-yellow-400 to-red-500", "from-teal-400 to-cyan-500"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/blog/`);
        if (response.status === 200) {
          setPosts(response.data);
        } else {
          toast.error("Failed to fetch posts. Please try again.");
        }
      } catch (error) {
        console.log("Error fetching posts:", error);
        toast.error("Failed to fetch posts. Please try again.");
      }
    }

    fetchPosts();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
          Welcome to ThoughtSpace
        </h1>
        <p className="text-xl md:text-2xl opacity-95">
          Exploring ideas, stories, and insights that matter
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className={`h-48 bg-gradient-to-br ${gradients[index % gradients.length]}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {post.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

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