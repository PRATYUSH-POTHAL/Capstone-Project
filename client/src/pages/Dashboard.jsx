import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Camera,
  Edit2,
  Trash2,
  Heart,
  MessageCircle,
  Save,
  X,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import Avatar from '../components/Avatar';
import {
  fetchUserPosts,
  updateUserProfile,
  deletePost as deletePostApi,
} from '../services/api';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '👤',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchUserPosts(user?.username);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setProfileData({ ...profileData, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updated = await updateUserProfile(profileData);
      updateUser(updated);
      setIsEditingProfile(false);
      setAvatarPreview(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">My Dashboard</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Feed
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {isEditingProfile ? (
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {avatarPreview || profileData.avatar?.startsWith('data:') ? (
                      <img
                        src={avatarPreview || profileData.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">{profileData.avatar}</span>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    <Camera size={24} className="text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user?.avatar?.startsWith('data:') || user?.avatar?.startsWith('http') ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.avatar || '👤'}</span>
                  )}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows="3"
                      maxLength="500"
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {profileData.bio.length}/500 characters
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileData({
                          name: user?.name || '',
                          bio: user?.bio || '',
                          avatar: user?.avatar || '👤',
                        });
                        setAvatarPreview(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600 mb-2">@{user?.username}</p>
                  <p className="text-gray-700">{user?.bio || 'No bio yet...'}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    <span>
                      <strong>{posts.length}</strong> Posts
                    </span>
                    <span>
                      <strong>{user?.followers?.length || 0}</strong> Followers
                    </span>
                    <span>
                      <strong>{user?.following?.length || 0}</strong> Following
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Posts Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Posts</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading your posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't posted anything yet.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">
                        {getTimeAgo(post.createdAt)}
                      </p>
                      <p className="text-gray-800">{post.content}</p>

                      {/* Media Display - Support for multiple media items */}
                      {post.mediaItems && post.mediaItems.length > 0 ? (
                        <div className={`mt-3 grid gap-2 ${post.mediaItems.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {post.mediaItems.map((media, index) => (
                            <div key={index} className="rounded-lg overflow-hidden">
                              {media.type === 'image' ? (
                                <img
                                  src={media.url}
                                  alt={`Post media ${index + 1}`}
                                  className="w-full max-h-64 object-cover"
                                />
                              ) : (
                                <video
                                  src={media.url}
                                  controls
                                  className="w-full max-h-64"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {/* Backward compatibility for old single media posts */}
                          {post.mediaUrl && post.mediaType === 'image' && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                              <img
                                src={post.mediaUrl}
                                alt="Post media"
                                className="w-full max-h-64 object-cover"
                              />
                            </div>
                          )}
                          {post.mediaUrl && post.mediaType === 'video' && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                              <video
                                src={post.mediaUrl}
                                controls
                                className="w-full max-h-64"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete post"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 pt-3 border-t">
                    <span className="flex items-center gap-1">
                      <Heart size={16} />
                      {post.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
