// import Feed from "../components/Feed"

// const Home = () => {
//   return (
//     <div>
//       <h1>SCROLLA Home Page</h1>
//     </div>
//   )
// }

// export default Home

import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Image,
  Video,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  fetchPosts as fetchPostsApi,
  createPost as createPostApi,
  likePost as likePostApi,
} from "../services/api";

const Home = () => {
  const { user, logout } = useAuth();
  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.split(" ")[0] || "Guest";
  const avatarChar = displayName.charAt(0)?.toUpperCase() || "G";
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [filter, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPostsApi();
      const normalized = Array.isArray(data) ? data : [];
      const filtered = normalized.filter((p) => {
        const content = (p?.content || "").toLowerCase();
        const username = (p?.username || "").toLowerCase();
        const q = (searchQuery || "").toLowerCase().trim();
        if (q && !content.includes(q) && !username.includes(q)) return false;
        return true;
      });
      setPosts(filtered);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const created = await createPostApi({
        username: user?.username || user?.name || "anonymous",
        content: newPost,
      });
      setPosts([created, ...posts]);
      setNewPost('');
      setShowNewPost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const updated = await likePostApi(postId);
      setPosts(posts.map((post) => (post._id === postId ? updated : post)));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async (postId) => {
    alert("Delete is not implemented on the backend yet.");
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-blue-600">SocialHub</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell size={24} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings size={24} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {avatarChar}
              </div>
              <button 
                onClick={logout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="col-span-3 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Filter by Category</h3>
                <div className="space-y-2">
                  {['all', 'product', 'technology', 'design', 'general'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filter === cat 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="col-span-12 lg:col-span-6">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {avatarChar}
                </div>
                <button
                  onClick={() => setShowNewPost(true)}
                  className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                >
                  What's on your mind, {firstName}?
                </button>
              </div>
              
              {showNewPost && (
                <div className="mt-4 border-t pt-4">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Image size={20} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Video size={20} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowNewPost(false);
                          setNewPost('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={!newPost.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500">No posts found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <article key={post._id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {post.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.username}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>@{post.username}</span>
                            <span>•</span>
                            <span>{getTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-800 mb-4">{post.content}</p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-6">
                        <button
                          onClick={() => handleLike(post._id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                        >
                          <Heart
                            size={20}
                            className=""
                          />
                          <span className="text-sm">{post.likes ?? 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                          <MessageCircle size={20} />
                          <span className="text-sm">{post.comments?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500">
                          <Share2 size={20} />
                        </button>
                      </div>
                      <button className="text-gray-600 hover:text-yellow-500">
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="col-span-3 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <h2 className="font-bold text-gray-900 mb-4">Trending Topics</h2>
              <div className="space-y-4">
                {[
                  { tag: 'WebDevelopment', posts: '2.3K' },
                  { tag: 'AI', posts: '1.8K' },
                  { tag: 'UXDesign', posts: '1.2K' }
                ].map((topic, i) => (
                  <div key={i} className="pb-4 border-b last:border-0">
                    <p className="text-sm text-gray-500">Trending</p>
                    <p className="font-semibold text-gray-900">#{topic.tag}</p>
                    <p className="text-sm text-gray-500">{topic.posts} posts</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;