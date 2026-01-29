import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 1,
    max: 120,
  },
  userType: {
    type: String,
    enum: ['kid', 'teen', 'adult'],
    required: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  avatar: {
    type: String,
    default: '👤',
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  preferences: {
    favoriteHashtags: [{
      type: String,
    }],
    blockedHashtags: [{
      type: String,
    }],
  },
  currentMood: {
    type: String,
    enum: ['calm', 'focused', 'motivated', 'low', 'happy', 'stressed', ''],
    default: '',
  },
  currentPurpose: {
    type: String,
    enum: ['learn', 'relax', 'discuss', 'inspire', 'entertain', ''],
    default: '',
  },
  timeConstraint: {
    type: Number,
    enum: [5, 10, 20, 30, 0],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)