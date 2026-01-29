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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import ShareModal from "../components/ShareModal";
import {
  fetchPosts as fetchPostsApi,
  createPost as createPostApi,
  likePost as likePostApi,
  deletePost as deletePostApi,
} from "../services/api";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.split(" ")[0] || "Guest";
  const avatarChar = displayName.charAt(0)?.toUpperCase() || "G";
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
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

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    if (uploading) return; // Prevent double submission

    try {
      setUploading(true);
      let mediaItems = [];

      // Handle multiple file uploads
      if (filePreviews.length > 0) {
        for (const preview of filePreviews) {
          // Check file size (limit to ~10MB for base64)
          const base64Length = preview.url.length;
          const sizeInMB = (base64Length * 0.75) / (1024 * 1024);
          if (sizeInMB > 10) {
            alert('One or more files are too large. Please select files smaller than 10MB each.');
            setUploading(false);
            return;
          }
          mediaItems.push({
            url: preview.url,
            type: preview.type,
          });
        }
      }

      const postData = {
        content: newPost,
        category: 'general',
        mediaItems: mediaItems,
        // Keep backward compatibility
        mediaUrl: mediaItems.length > 0 ? mediaItems[0].url : '',
        mediaType: mediaItems.length > 0 ? mediaItems[0].type : 'none',
      };

      const created = await createPostApi(postData);
      setPosts([created, ...posts]);
      setNewPost('');
      setShowNewPost(false);
      setSelectedFiles([]);
      setFilePreviews([]);
    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create post';
      alert(`Failed to create post: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate file types and add to arrays
    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        alert(`${file.name} is not a valid image or video file`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => [...prev, {
          url: reader.result,
          type: isVideo ? 'video' : 'image',
          name: file.name,
        }]);
      };
      reader.readAsDataURL(file);
      
      setSelectedFiles(prev => [...prev, file]);
    });
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
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
                <Avatar user={user} size="md" />
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
                  
                  {/* File Previews */}
                  {filePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {filePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          {preview.type === 'image' ? (
                            <img 
                              src={preview.url} 
                              alt={`Preview ${index + 1}`}
                              className="w-full h-48 rounded-lg object-cover"
                            />
                          ) : (
                            <video 
                              src={preview.url} 
                              controls 
                              className="w-full h-48 rounded-lg"
                            />
                          )}
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="media-upload"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        multiple
                        className="hidden"
                      />
                      <label htmlFor="media-upload" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full cursor-pointer">
                        <Image size={20} className="text-gray-600" />
                        <Video size={20} className="text-gray-600" />
                        <span className="text-sm text-gray-600">Add Photos/Videos</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowNewPost(false);
                          setNewPost('');
                          setSelectedFiles([]);
                          setFilePreviews([]);
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newPost.trim() || uploading}
                      >
                        {uploading ? 'Posting...' : 'Post'}
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
                        <Avatar user={post.author} size="lg" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.author?.name || post.username}</h3>
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