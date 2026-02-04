import { useState } from 'react'

const LikeButton = ({ postId, isLiked: initialIsLiked, likesCount, onLike }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [count, setCount] = useState(likesCount)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = async () => {
    // Optimistic update
    setIsLiked(!isLiked)
    setCount(isLiked ? count - 1 : count + 1)
    setIsAnimating(true)
    
    setTimeout(() => setIsAnimating(false), 300)

    // Call parent handler
    if (onLike) {
      await onLike()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isLiked 
          ? 'text-red-500 hover:bg-red-50' 
          : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
      } ${isAnimating ? 'scale-110' : ''}`}
    >
      <svg 
        className={`w-5 h-5 transition-all ${isAnimating ? 'scale-125' : ''}`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span className="font-medium">{count}</span>
    </button>
  )
}

export default LikeButton
