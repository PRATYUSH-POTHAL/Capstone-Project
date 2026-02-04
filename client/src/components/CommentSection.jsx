import { useState, useContext } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Avatar from './Avatar'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const { user: currentUser } = useContext(AuthContext)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [localComments, setLocalComments] = useState(comments || [])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!commentText.trim()) return

    setIsSubmitting(true)
    try {
      const response = await api.post(`/posts/${postId}/comment`, { text: commentText })
      setLocalComments(response.data.comments)
      setCommentText('')
      if (onCommentAdded) {
        onCommentAdded(response.data)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.put(`/posts/comment/${commentId}/like`)
      setLocalComments(response.data.comments)
      if (onCommentAdded) {
        onCommentAdded(response.data)
      }
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      {/* Comment Count Toggle */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-gray-600 hover:text-gray-800 font-medium mb-3 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {localComments.length} {localComments.length === 1 ? 'Comment' : 'Comments'}
      </button>

      {/* Comment Input */}
      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {showComments && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {localComments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          ) : (
            localComments.map((comment) => {
              const isLiked = comment.likes?.includes(currentUser?._id)
              const likesCount = comment.likes?.length || 0
              
              return (
              <div key={comment._id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar 
                  user={comment.user} 
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{comment.user?.name || 'Unknown User'}</span>
                    <span className="text-gray-500 text-xs">
                      @{comment.user?.username || 'unknown'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm mb-2">{comment.text}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`text-xs flex items-center gap-1 transition-colors ${
                        isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {likesCount > 0 && <span>{likesCount}</span>}
                    </button>
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      )}
    </div>
  )
}

export default CommentSection