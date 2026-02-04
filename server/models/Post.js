import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: 2000,
  },
  image: {
    type: String,
  },
  mediaUrl: {
    type: String,
    default: '',
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'none'],
    default: 'none',
  },
  mediaItems: [{
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
  }],
  hashtags: [{
    type: String,
    lowercase: true,
  }],
  ageRestriction: {
    type: String,
    enum: ['kids', 'teen', 'adult'],
    required: true,
    default: 'adult',
  },
  moodTags: [{
    type: String,
    enum: ['calm', 'energetic', 'motivational', 'relaxing', 'uplifting', 'focused', 'fun'],
  }],
  purposeTags: [{
    type: String,
    enum: ['learn', 'relax', 'inspire', 'discuss', 'entertain'],
  }],
  contentType: {
    type: String,
    enum: ['educational', 'entertainment', 'cartoon', 'motivational', 'news', 'lifestyle', 'other'],
    default: 'other',
  },
  category: {
    type: String,
    enum: ['general', 'product', 'technology', 'design', 'business', 'other'],
    default: 'general',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  shares: {
    type: Number,
    default: 0,
  },
  interactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['reflection', 'choice', 'emotion'],
    },
    response: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Indexes for better query performance
postSchema.index({ hashtags: 1 })
postSchema.index({ ageRestriction: 1 })
postSchema.index({ moodTags: 1 })
postSchema.index({ purposeTags: 1 })
postSchema.index({ contentType: 1 })
postSchema.index({ createdAt: -1 })

// Index for faster queries
postSchema.index({ author: 1, createdAt: -1 })
postSchema.index({ category: 1 })

export default mongoose.model('Post', postSchema)