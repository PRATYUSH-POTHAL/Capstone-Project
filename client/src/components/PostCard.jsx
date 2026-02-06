import { useState, useContext, useEffect, useRef, memo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Avatar from './Avatar'
import LikeButton from './LikeButton'
import ShareModal from './ShareModal'
import CommentSection from './CommentSection'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

const PostCard = ({ post: initialPost, onPostDeleted, onPostUpdated }) => {
  const { user: currentUser } = useContext(AuthContext)
  const [post, setPost] = useState(initialPost)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const menuRef = useRef(null)
  const commentSectionRef = useRef(null)

  const isOwnPost = currentUser?._id === post.author?._id

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleLike = async () => {
    try {
      const response = await api.put(`/posts/${post._id}/like`)
      setPost(response.data)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleShare = async () => {
    try {
      await api.post(`/posts/${post._id}/share`)
      setShowShareModal(true)
    } catch (error) {
      console.error('Error sharing post:', error)
    }
  }

  const handleCommentClick = () => {
    setShowComments(!showComments)
    // Focus input after toggle
    if (!showComments) {
      setTimeout(() => {
        const input = commentSectionRef.current?.querySelector('input')
        if (input) input.focus()
      }, 100)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api.delete(`/posts/${post._id}`)
      setShowDeleteConfirm(false)
      if (onPostDeleted) {
        onPostDeleted(post._id)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(post.content)
    setShowMenu(false)
  }

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      alert('Post content cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      const response = await api.put(`/posts/${post._id}`, { content: editContent })
      setPost(response.data)
      setIsEditing(false)
      if (onPostUpdated) {
        onPostUpdated(response.data)
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(post.content)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar user={post.author} size="md" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{post.author?.name || 'Unknown User'}</h3>
            <span className="text-gray-500 text-sm">@{post.author?.username || 'unknown'}</span>
          </div>
          <p className="text-gray-500 text-sm">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
        
        {/* Three Dot Menu (only for own posts) */}
        {isOwnPost && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Edit</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowDeleteConfirm(true)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-left transition-colors border-t border-gray-200"
                >
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-red-600 font-medium">Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
              placeholder="Edit your post..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors font-medium"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap break-words">{post.content}</p>
        )}
        
        {/* Display hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags.map((tag, index) => (
              <span key={index} className="text-blue-500 text-sm hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Display media */}
        {post.image && (
          <img 
            src={post.image} 
            alt="Post content" 
            className="mt-4 rounded-lg w-full object-cover max-h-96"
          />
        )}

        {post.mediaItems && post.mediaItems.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {post.mediaItems.map((item, index) => (
              <div key={index}>
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={`Media ${index + 1}`} 
                    className="rounded-lg w-full object-cover h-48"
                  />
                ) : (
                  <video 
                    src={item.url} 
                    controls 
                    className="rounded-lg w-full h-48"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className="flex items-center gap-4 py-3 border-t border-b border-gray-200 text-sm text-gray-600">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
        <span>{post.shares || 0} shares</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around py-2">
        <LikeButton 
          postId={post._id}
          isLiked={post.likes?.includes(post.author?._id)}
          likesCount={post.likes?.length || 0}
          onLike={handleLike}
        />
        
        <button 
          onClick={handleCommentClick}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">Comment</span>
        </button>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comment Section */}
      <div ref={commentSectionRef}>
        <CommentSection 
          postId={post._id} 
          commentCount={post.comments?.length || 0}
          isOpen={showComments}
          onToggle={() => setShowComments(!showComments)}
        />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal 
          post={post} 
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-3">R U SURE ABOUT IT??</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone. Your post will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors font-medium"
              >
                {isDeleting ? 'Deleting...' : 'OK, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(PostCard)
