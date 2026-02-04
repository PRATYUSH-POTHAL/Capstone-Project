import React, { useState, useEffect, useRef } from 'react';
import { Image, Video, X, ChevronDown } from 'lucide-react';
import MoodSelector from './MoodSelector';

const CreatePost = ({ onPostCreated, onCancel }) => {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [moodData, setMoodData] = useState(null);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const moodOptions = [
    { value: 'calm', label: 'Calm', emoji: '😌', tags: ['calm', 'relaxing'] },
    { value: 'energetic', label: 'Energetic', emoji: '⚡', tags: ['energetic'] },
    { value: 'motivational', label: 'Motivational', emoji: '💪', tags: ['motivational', 'uplifting'] },
    { value: 'sad', label: 'Sad', emoji: '😢', tags: ['sad'] },
    { value: 'fun', label: 'Fun', emoji: '🎉', tags: ['fun'] },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMoodDropdown(false);
      }
    };

    if (showMoodDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoodDropdown]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        alert('Please select only image or video files');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews((prev) => [
          ...prev,
          {
            url: reader.result,
            type: isImage ? 'image' : 'video',
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && filePreviews.length === 0) {
      alert('Please add some content or media to your post');
      return;
    }

    if (uploading) return;

    try {
      setUploading(true);

      const mediaItems = filePreviews.map((preview) => ({
        url: preview.url,
        type: preview.type,
      }));

      // Get moodTags from either the dropdown selection or full mood selector
      let moodTags = [];
      let purposeTags = [];
      
      if (moodData?.tags) {
        // From quick mood selection
        moodTags = moodData.tags;
      } else if (moodData?.mood) {
        // From full MoodSelector flow
        const moodToTagsMap = {
          'calm': ['calm', 'relaxing'],
          'focused': ['focused'],
          'motivated': ['motivational', 'uplifting'],
          'low': ['uplifting'],
          'happy': ['fun', 'uplifting'],
          'stressed': ['calm', 'relaxing'],
        };
        moodTags = moodToTagsMap[moodData.mood] || [];
        purposeTags = moodData.purpose ? [moodData.purpose] : [];
      }

      const postData = {
        content,
        category: 'general',
        mediaItems,
        moodTags,
        purposeTags,
      };

      if (onPostCreated) {
        await onPostCreated(postData);
      }

      // Reset form
      setContent('');
      setSelectedFiles([]);
      setFilePreviews([]);
      setMoodData(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleQuickMoodSelect = (mood) => {
    setMoodData({
      mood: mood.value,
      label: mood.label,
      emoji: mood.emoji,
      tags: mood.tags,
    });
    setShowMoodDropdown(false);
  };

  const handleMoodComplete = (mood) => {
    setMoodData(mood);
    setShowMoodSelector(false);
  };

  if (showMoodSelector) {
    return <MoodSelector onComplete={handleMoodComplete} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Create Post</h3>
        <button
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
          className="text-gray-400 hover:text-gray-600"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      />

      {/* File Previews */}
      {filePreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {filePreviews.map((preview, index) => (
            <div key={index} className="relative">
              {preview.type === 'image' ? (
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={preview.url}
                  className="w-full h-32 object-cover rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mood Display */}
      {moodData && (
        <div className="mt-3 inline-flex items-center bg-purple-100 border border-purple-300 px-4 py-2 rounded-full text-sm">
          <span className="text-purple-700 font-medium">
            {moodData.emoji} {moodData.label}
          </span>
          <button
            onClick={() => setMoodData(null)}
            className="ml-2 text-purple-500 hover:text-purple-700"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Add photos or videos">
            <Image size={20} className="text-gray-600" />
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          
          {/* Quick Mood Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowMoodDropdown(!showMoodDropdown)}
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-lg transition-colors"
              title="Select mood for this post"
            >
              <span className="text-xl">😊</span>
              <span className="text-sm font-medium text-purple-700">Select Mood</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            
            {showMoodDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleQuickMoodSelect(mood)}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-purple-50 text-left transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-sm text-gray-700">{mood.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={uploading || (!content.trim() && filePreviews.length === 0)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
