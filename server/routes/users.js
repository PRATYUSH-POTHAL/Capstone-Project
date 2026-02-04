import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

// Get current user
router.get('/me', protect, (req, res) => {
  res.json(req.user)
})

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body
    
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    if (name) user.name = name
    if (bio !== undefined) user.bio = bio
    if (avatar) user.avatar = avatar
    
    await user.save()
    
    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password')
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Follow a user
router.post('/:userId/follow', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId)
    const currentUser = await User.findById(req.user._id)

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' })
    }

    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already following this user' })
    }

    // Add to following and followers
    currentUser.following.push(req.params.userId)
    userToFollow.followers.push(req.user._id)

    await currentUser.save()
    await userToFollow.save()

    res.json({ 
      message: 'User followed successfully',
      following: currentUser.following,
      followers: userToFollow.followers
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Unfollow a user
router.delete('/:userId/follow', protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId)
    const currentUser = await User.findById(req.user._id)

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.userId
    )
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    )

    await currentUser.save()
    await userToUnfollow.save()

    res.json({ 
      message: 'User unfollowed successfully',
      following: currentUser.following,
      followers: userToUnfollow.followers
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user's followers
router.get('/:userId/followers', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'name username avatar')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user.followers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user's following
router.get('/:userId/following', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'name username avatar')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user.following)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
