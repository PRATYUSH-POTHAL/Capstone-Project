import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export const register = async (req, res) => {
  try {
    const { name, email, password, username, age } = req.body

    // Validate age
    if (!age || age < 1 || age > 120) {
      return res.status(400).json({ message: 'Please provide a valid age' })
    }

    // Determine user type based on age
    let userType
    if (age < 13) {
      userType = 'kid'
    } else if (age < 18) {
      userType = 'teen'
    } else {
      userType = 'adult'
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      username,
      age,
      userType,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      age: user.age,
      userType: user.userType,
      avatar: user.avatar,
      bio: user.bio,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      return res.status(401).json({ message: 'No account found with this email' })
    }
    
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Wrong password. Please try again.' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      age: user.age,
      userType: user.userType,
      avatar: user.avatar,
      bio: user.bio,
      currentMood: user.currentMood,
      currentPurpose: user.currentPurpose,
      timeConstraint: user.timeConstraint,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateMoodAndIntent = async (req, res) => {
  try {
    const { mood, purpose, timeConstraint } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        currentMood: mood || '',
        currentPurpose: purpose || '',
        timeConstraint: timeConstraint || 0,
      },
      { new: true }
    )

    res.json({
      message: 'Mood and intent updated successfully',
      mood: user.currentMood,
      purpose: user.currentPurpose,
      timeConstraint: user.timeConstraint,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    console.log('Reset password request received:', { email: req.body.email })
    const { email, newPassword } = req.body

    if (!email || !newPassword) {
      console.log('Missing email or password')
      return res.status(400).json({ message: 'Please provide email and new password' })
    }

    if (newPassword.length < 6) {
      console.log('Password too short')
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Find user by email only
    const user = await User.findOne({ email }).select('+password')
    console.log('User found:', user ? 'Yes' : 'No')

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    // Update password - the pre-save hook will hash it automatically
    user.password = newPassword
    await user.save()
    console.log('Password updated successfully')

    res.json({
      message: 'Password reset successful! You can now login with your new password.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: error.message })
  }
}