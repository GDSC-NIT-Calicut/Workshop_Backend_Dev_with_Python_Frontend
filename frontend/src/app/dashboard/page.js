"use client";
import { useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAuth from "@/hooks/authHook";


export default function BlogDashboard() {
  const [activeTab, setActiveTab] = useState("create");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const { loading, username, id, logout } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const router = useRouter();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!id) {
      router.push("/login");
    }
  }, [loading, username, id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        if(!access_token) {
          toast.error("You must be logged in to view your posts");
          router.push("/login");
          return;
        }
        const response = await axios.get(`${BACKEND_URL}/api/me/`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (response.status === 200) {
          console.log("Fetched posts:", response.data.blogs);
          setPosts(response.data.blogs);
        } else {
          toast.error("Failed to fetch posts. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts. Please try again.");
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.body) {
      toast.warning("Please fill in all required fields");
      return;
    }

    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      toast.error("You must be logged in to publish a post");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/blog`,
        {
          title: formData.title,
          body: formData.body,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Post published successfully!");
        setPosts([...posts, response.data]);

        setFormData({ title: "", body: "" });
      } else {
        toast.error("Failed to publish post. Please try again.");
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        toast.error("You must be logged in to delete a post");
        router.push("/login");
        return;
      }

      const response = await axios.delete(`${BACKEND_URL}/api/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      toast.success("Post deleted successfully!");
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.log("Error deleting post:", error);

      if (error.response) {
        if (error.response.status === 403) {
          toast.error("You do not have permission to delete this post.");
        } else if (error.response.status === 404) {
          toast.error("Post not found. It may have already been deleted.");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized. Please log in again.");
        } else {
          toast.error("Failed to delete post. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      body: post.body,
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingPost(null);
    setFormData({ title: "", body: "" });
  };

  const handleUpdatePost = async () => {
    if (!formData.title || !formData.body) {
      toast.warning("Please fill in all required fields");
      return;
    }
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      toast.error("You must be logged in to update a post");
      router.push("/login");
      return;
    }

    console.log("Editing post data:", editingPost);

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/blog/${editingPost.id}`,
        {
          title: formData.title,
          body: formData.body,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("Update response:", response);

      if (response.status === 200) {
        toast.success("Post updated successfully!");
        setPosts(
          posts.map((post) =>
            post.id === editingPost.id
              ? { ...post, title: formData.title, body: formData.body }
              : post
          )
        );
        handleCancelEdit();
      } else {
        toast.error("Failed to update post. Please try again.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.response) {
        if (error.response.status === 403) {
          toast.error("You do not have permission to edit this post.");
        } else if (error.response.status === 404) {
          toast.error("Post not found.");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized. Please log in again.");
        } else {
          toast.error("Failed to update post. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-white text-2xl font-bold tracking-tight">
              ThoughtSpace Dashboard
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={"/"}
                className="text-white hover:opacity-80 transition-opacity"
              >
                View Site
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-white hidden sm:block">{username}</span>
              </div>
              <button
                onClick={logout}
                className="text-white hover:opacity-80 transition-opacity"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("create")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "create"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Create Post
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "manage"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Manage Posts
              </button>
            </nav>
          </div>

          {activeTab === "create" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create New Post
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Enter post title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    placeholder="Write your post content here..."
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handlePublish}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Publish Post
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "manage" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Manage Posts
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Title
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                          {post.title}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(post)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditMode && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCancelEdit}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
                    placeholder="Write your post content here..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdatePost(formData.id)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Update Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
