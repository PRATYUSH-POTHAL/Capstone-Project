import { useState, useContext, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Avatar from './Avatar'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

const CommentSection = ({ postId, commentCount, isOpen, onToggle }) => {
  const { user: currentUser } = useContext(AuthContext)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localComments, setLocalComments] = useState([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  // Load comments when opened
  useEffect(() => {
    if (isOpen && localComments.length === 0) {
      loadComments()
    }
  }, [isOpen])

  const loadComments = async () => {
    setIsLoadingComments(true)
    try {
      const response = await api.get(`/posts/${postId}/comments`)
      setLocalComments(response.data)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!commentText.trim()) return

    setIsSubmitting(true)
    try {
      const response = await api.post(`/posts/${postId}/comment`, { text: commentText })
      setLocalComments(response.data.comments)
      setCommentText('')
      // Open comments if not already open
      if (!isOpen && onToggle) {
        onToggle()
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
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const displayCount = localComments.length || commentCount || 0

  if (!isOpen) {
    return null
  }

  return (
    <div className="mt-4 border-t pt-4">
      {/* Comment Input - Instagram Style */}
      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex gap-2 items-center">
          <Avatar user={currentUser} size="sm" />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 border-0 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isSubmitting}
            autoFocus
          />
          {commentText.trim() && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-blue-500 font-semibold hover:text-blue-600 disabled:text-blue-300 transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          )}
        </div>
      </form>

      {/* Comments List - Instagram Style */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {isLoadingComments ? (
          <p className="text-gray-400 text-center py-4 text-sm">Loading comments...</p>
        ) : localComments.length === 0 ? (
          <p className="text-gray-400 text-center py-4 text-sm">No comments yet.</p>
        ) : (
          localComments.map((comment) => {
            const isLiked = comment.likes?.includes(currentUser?._id)
            const likesCount = comment.likes?.length || 0
            
            return (
            <div key={comment._id} className="flex gap-3">
              <Avatar 
                user={comment.user} 
                size="sm"
              />
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold mr-2">{comment.user?.username || 'unknown'}</span>
                      <span className="text-gray-800">{comment.text}</span>
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-gray-400 text-xs">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                      {likesCount > 0 && (
                        <span className="text-gray-400 text-xs font-semibold">
                          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="mt-1"
                  >
                    {isLiked ? (
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  )
}

export default CommentSection