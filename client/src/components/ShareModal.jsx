import React from 'react';
import { X, Copy, Check } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, post }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const postUrl = `${window.location.origin}/post/${post._id}`;
  const shareText = `Check out this post on Scrolla: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`,
    },
    {
      name: 'Twitter',
      icon: '𝕏',
      color: 'bg-black hover:bg-gray-800',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: 'Facebook',
      icon: '👤',
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Email',
      icon: '📧',
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent('Check out this post')}&body=${encodeURIComponent(shareText + '\n\n' + postUrl)}`,
    },
  ];

  const handleShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Share Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Share Options Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => handleShare(option.url)}
              className={`${option.color} text-white p-4 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105`}
            >
              <span className="text-3xl mb-2">{option.icon}</span>
              <span className="text-xs font-medium">{option.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">Or copy link</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={postUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? (
                <div className="flex items-center gap-1">
                  <Check size={16} />
                  <span>Copied!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Copy size={16} />
                  <span>Copy</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
