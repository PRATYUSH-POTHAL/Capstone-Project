import React from 'react';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
    '2xl': 'w-24 h-24 text-4xl',
  };

  // Handle cases where user might be undefined or null
  if (!user) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 ${className}`}
      >
        <span>U</span>
      </div>
    );
  }

  const avatarData = user.avatar || '👤';
  const fallbackChar = (user.name || user.username || 'U').charAt(0).toUpperCase();
  const isImage = avatarData?.startsWith('data:') || avatarData?.startsWith('http');

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 ${className}`}
    >
      {isImage ? (
        <img
          src={avatarData}
          alt={user.name || user.username || 'User'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<span>${fallbackChar}</span>`;
          }}
        />
      ) : (
        <span>{avatarData === '👤' ? fallbackChar : avatarData}</span>
      )}
    </div>
  );
};

export default Avatar;
