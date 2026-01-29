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

export default router
