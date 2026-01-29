import express from 'express'
import { 
  getPosts, 
  createPost, 
  likePost, 
  deletePost,
  getPersonalizedFeed,
  getKidsZoneContent,
  getPostsByHashtag,
  addComment,
  sharePost,
  addInteraction,
  getUserPosts
} from '../controllers/postController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getPosts)
router.get('/feed', protect, getPersonalizedFeed)
router.get('/kids-zone', protect, getKidsZoneContent)
router.get('/hashtag/:hashtag', protect, getPostsByHashtag)
router.get('/user/:username', protect, getUserPosts)
router.post('/', protect, createPost)
router.put('/:id/like', protect, likePost)
router.post('/:id/comment', protect, addComment)
router.post('/:id/share', protect, sharePost)
router.post('/:id/interact', protect, addInteraction)
router.delete('/:id', protect, deletePost)

export default router