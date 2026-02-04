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
import { useNavigate } from "react-router-dom";
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
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import ShareModal from "../components/ShareModal";
import CreatePost from "../components/CreatePost";
import {
  fetchPosts as fetchPostsApi,
  createPost as createPostApi,
  likePost as likePostApi,
  deletePost as deletePostApi,
  followUser as followUserApi,
  unfollowUser as unfollowUserApi,
} from "../services/api";

const Home = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.split(" ")[0] || "Guest";
  const avatarChar = displayName.charAt(0)?.toUpperCase() || "G";
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [filter, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPostsApi({
        category: filter,
        search: searchQuery,
      });
      const normalized = Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : [];
      
      // Debug: Log to check if author data is coming through
      if (normalized.length > 0) {
        console.log('Sample post with author:', normalized[0]);
      }
      
      const filtered = normalized.filter((p) => {
        const content = (p?.content || "").toLowerCase();
        const username = (p?.author?.username || p?.username || "").toLowerCase();
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

  const handlePostCreated = async (postData) => {
    try {
      const created = await createPostApi(postData);
      setPosts([created, ...posts]);
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
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

  const handleShare = (post) => {
    setPostToShare(post);
    setShareModalOpen(true);
  };

  const handleFollow = async (userId) => {
    try {
      await followUserApi(userId);
      // Update user's following list
      updateUser({
        ...user,
        following: [...(user.following || []), userId]
      });
    } catch (error) {
      console.error('Error following user:', error);
      alert(error.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUserApi(userId);
      // Update user's following list
      updateUser({
        ...user,
        following: (user.following || []).filter(id => id !== userId)
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Failed to unfollow user');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePostApi(postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
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
            <h1 className="text-2xl font-bold text-blue-600">Scrolla</h1>
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
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Dashboard"
            >
              <Settings size={24} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div onClick={() => navigate('/dashboard')} className="cursor-pointer hover:opacity-80">
                <Avatar user={user} size="md" />
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
                <h3 className="font-semibold text-gray-900 mb-3">Filter by Mood</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Posts', emoji: '📝' },
                    { value: 'calm', label: 'Calm', emoji: '😌' },
                    { value: 'energetic', label: 'Energetic', emoji: '⚡' },
                    { value: 'motivational', label: 'Motivational', emoji: '💪' },
                    { value: 'sad', label: 'Sad', emoji: '😢' },
                    { value: 'fun', label: 'Fun', emoji: '🎉' }
                  ].map(mood => (
                    <button
                      key={mood.value}
                      onClick={() => setFilter(mood.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        filter === mood.value 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="col-span-12 lg:col-span-6">
            {/* Create Post Button */}
            {!showCreatePost && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex gap-3">
                  <Avatar user={user} size="md" />
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                  >
                    What's on your mind, {firstName}?
                  </button>
                </div>
              </div>
            )}
            
            {/* Create Post Component with Mood Selector */}
            {showCreatePost && (
              <CreatePost 
                onPostCreated={handlePostCreated} 
                onCancel={() => setShowCreatePost(false)}
              />
            )}

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
                        <Avatar user={post.author} size="lg" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{post.author?.name || post.username}</h3>
                            {post.author?._id !== user?._id && (
                              <button
                                onClick={() => {
                                  const isFollowing = user?.following?.includes(post.author._id);
                                  isFollowing ? handleUnfollow(post.author._id) : handleFollow(post.author._id);
                                }}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  user?.following?.includes(post.author._id)
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {user?.following?.includes(post.author._id) ? (
                                  <>
                                    <UserMinus size={14} />
                                    <span>Unfollow</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus size={14} />
                                    <span>Follow</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>@{post.author?.username || post.username}</span>
                            <span>•</span>
                            <span>{getTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {post.author?._id === user?._id && (
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="p-2 hover:bg-red-50 rounded-full"
                            title="Delete"
                          >
                            <span className="text-red-600 text-sm font-semibold">Del</span>
                          </button>
                        )}
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-800 mb-4">{post.content}</p>

                    {/* Media Display - Support for multiple media items */}
                    {post.mediaItems && post.mediaItems.length > 0 ? (
                      <div className={`mb-4 grid gap-2 ${post.mediaItems.length === 1 ? 'grid-cols-1' : post.mediaItems.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                        {post.mediaItems.map((media, index) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            {media.type === 'image' ? (
                              <img 
                                src={media.url} 
                                alt={`Post media ${index + 1}`}
                                className="w-full h-full max-h-96 object-cover"
                              />
                            ) : (
                              <video 
                                src={media.url} 
                                controls 
                                className="w-full max-h-96"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {/* Backward compatibility for old single media posts */}
                        {post.mediaUrl && post.mediaType === 'image' && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <img 
                              src={post.mediaUrl} 
                              alt="Post media" 
                              className="w-full max-h-96 object-cover"
                            />
                          </div>
                        )}
                        {post.mediaUrl && post.mediaType === 'video' && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <video 
                              src={post.mediaUrl} 
                              controls 
                              className="w-full max-h-96"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-6">
                        <button
                          onClick={() => handleLike(post._id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                        >
                          <Heart
                            size={20}
                            className={post.likes?.includes(user?._id) ? 'fill-red-500 text-red-500' : ''}
                          />
                          <span className="text-sm">{post.likes?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                          <MessageCircle size={20} />
                          <span className="text-sm">{post.comments?.length || 0}</span>
                        </button>
                        <button 
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                        >
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
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        post={postToShare} 
      />
    </div>
  );
};

export default Home;