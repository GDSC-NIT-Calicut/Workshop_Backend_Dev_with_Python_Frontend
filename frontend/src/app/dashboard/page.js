"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';       
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function BlogDashboard() {
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";  
  const router = useRouter();

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "The Future of Web Development in 2025",
      category: "Technology",
      status: "Published",
      date: "Oct 15, 2025",
      views: 1243
    },
    {
      id: 2,
      title: "Mastering Minimalist Design",
      category: "Design",
      status: "Published",
      date: "Oct 12, 2025",
      views: 856
    },
    {
      id: 3,
      title: "Finding Balance in a Digital World",
      category: "Lifestyle",
      status: "Draft",
      date: "Oct 10, 2025",
      views: 0
    }
  ]);

  useEffect(() => {
    const fetchPosts = async () => {
        const access_token = localStorage.getItem('access_token'); 
        const response = await axios.get(`${BACKEND_URL}/api/blog`, {
            headers: {
                Authorization: `Bearer ${access_token}` 
            }
        });
        return response;
    }

    try {
        const response = fetchPosts();
        if(response.status === 200) {
            setPosts(response.data);
        } else {
            toast.error('Failed to fetch posts. Please try again.');
        }
    } catch(error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to fetch posts. Please try again.');
    }
    
  }, [])


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.body) {
      toast.warning('Please fill in all required fields');
      return;
    }

    const access_token = localStorage.getItem('access_token');
    if(!access_token) {
        toast.error('You must be logged in to publish a post');
        router.push('/login');
        return;
    }
    
    try {
        const response = await axios.post(`${BACKEND_URL}/api/blog`, {
            title: formData.title,
            body: formData.body
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        if(response.status === 200 || response.status === 201) {
            toast.success('Post published successfully!');
            setPosts([...posts, formData]);
            setFormData({ title: '', body: '' });
        } else {
            toast.error('Failed to publish post. Please try again.');
        }
    } catch(error) {
        console.error('Error publishing post:', error);
        toast.error('Failed to publish post. Please try again.');
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== id));
      // delete endpoint
      toast.success('Post deleted successfully!');
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
              <button className="text-white hover:opacity-80 transition-opacity">
                View Site
              </button>
              <div className="flex items-center space-x-3">

                <span className="text-white hidden sm:block">Sarah Chen</span>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'create'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create Post
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'manage'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Posts
              </button>
            </nav>
          </div>

          {activeTab === 'create' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
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

          {activeTab === 'manage' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Posts</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-gray-900 font-medium">{post.title}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
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
    </div>
  );
}