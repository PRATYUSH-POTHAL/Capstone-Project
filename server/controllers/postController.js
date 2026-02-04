// import Post from "../models/Post.js"

// // @desc    Create a new post
// // @route   POST /api/posts
// export const createPost = async (req, res) => {
//   try {
//     const { username, content } = req.body

//     if (!username || !content) {
//       return res.status(400).json({ message: "All fields are required" })
//     }

//     const post = new Post({
//       username,
//       content,
//     })

//     const savedPost = await post.save()
//     res.status(201).json(savedPost)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// // @desc    Get all posts
// // @route   GET /api/posts
// export const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 })
//     res.status(200).json(posts)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// // @desc    Like a post
// // @route   PUT /api/posts/:id/like
// export const likePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id)

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" })
//     }

//     post.likes += 1
//     await post.save()

//     res.status(200).json(post)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// // @desc    Add comment to post
// // @route   POST /api/posts/:id/comment
// export const addComment = async (req, res) => {
//   try {
//     const { user, text } = req.body
//     const post = await Post.findById(req.params.id)

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" })
//     }

//     post.comments.push({ user, text })
//     await post.save()

//     res.status(200).json(post)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

import Post from '../models/Post.js'
import User from '../models/User.js'

// Get personalized feed based on user's mood, purpose, and age
export const getPersonalizedFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const { mood, purpose, timeConstraint, hashtag } = req.query

    // Build query based on user's age and preferences
    let query = {}

    // Age-based filtering
    if (user.userType === 'kid') {
      query.ageRestriction = 'kids'
      query.contentType = { $in: ['cartoon', 'educational'] }
    } else if (user.userType === 'teen') {
      query.ageRestriction = { $in: ['kids', 'teen'] }
    } else {
      // Adults can see all content
      query.ageRestriction = { $in: ['kids', 'teen', 'adult'] }
    }

    // Mood-based filtering
    const currentMood = mood || user.currentMood
    if (currentMood) {
      const moodMap = {
        'calm': ['calm', 'relaxing'],
        'focused': ['focused', 'educational'],
        'motivated': ['motivational', 'uplifting', 'energetic'],
        'low': ['uplifting', 'fun', 'motivational'],
        'happy': ['fun', 'energetic'],
        'stressed': ['calm', 'relaxing'],
      }
      if (moodMap[currentMood]) {
        query.moodTags = { $in: moodMap[currentMood] }
      }
    }

    // Purpose-based filtering
    const currentPurpose = purpose || user.currentPurpose
    if (currentPurpose) {
      query.purposeTags = currentPurpose
    }

    // Hashtag filtering
    if (hashtag) {
      query.hashtags = hashtag.toLowerCase().replace('#', '')
    }

    // Time constraint (limit number of posts)
    const currentTimeConstraint = timeConstraint || user.timeConstraint || 20
    const postsLimit = Math.ceil(currentTimeConstraint / 2) // Approx 2 min per post

    const posts = await Post.find(query)
      .populate('author', 'name username avatar age userType')
      .populate('comments.user', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(postsLimit)

    res.json({
      posts,
      journey: {
        totalPosts: posts.length,
        currentPost: 0,
        timeLimit: currentTimeConstraint,
        mood: currentMood,
        purpose: currentPurpose,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get kids zone content
export const getKidsZoneContent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    // Restrict access to kids only
    if (user.userType !== 'kid') {
      return res.status(403).json({ 
        message: 'Kids Zone is only accessible to users under 13 years old' 
      })
    }

    const posts = await Post.find({
      ageRestriction: 'kids',
      contentType: { $in: ['cartoon', 'educational'] },
    })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({ posts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get posts by hashtag
export const getPostsByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params
    const user = await User.findById(req.user._id)

    let query = {
      hashtags: hashtag.toLowerCase().replace('#', ''),
    }

    // Apply age restriction
    if (user.userType === 'kid') {
      query.ageRestriction = 'kids'
    } else if (user.userType === 'teen') {
      query.ageRestriction = { $in: ['kids', 'teen'] }
    }

    const posts = await Post.find(query)
      .populate('author', 'name username avatar')
      .populate('comments.user', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(50)

    res.json({ posts, hashtag })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query
    const user = await User.findById(req.user._id)
    
    let query = {}

    // Age-based filtering
    if (user.userType === 'kid') {
      query.ageRestriction = 'kids'
    } else if (user.userType === 'teen') {
      query.ageRestriction = { $in: ['kids', 'teen'] }
    }
    
    // Mood-based filtering (replacing category filtering)
    if (category && category !== 'all') {
      // Check if it's a mood filter
      const validMoods = ['calm', 'energetic', 'motivational', 'sad', 'fun']
      if (validMoods.includes(category)) {
        query.moodTags = category
      }
    }
    
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { hashtags: { $regex: search, $options: 'i' } },
      ]
    }

    const posts = await Post.find(query)
      .populate('author', 'name username avatar')
      .populate('comments.user', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Post.countDocuments(query)

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  try {
    const { content, category, image, mediaUrl, mediaType, mediaItems, hashtags, moodTags, purposeTags, contentType } = req.body
    const user = await User.findById(req.user._id)

    // Determine age restriction based on user's age
    let ageRestriction
    if (user.userType === 'kid') {
      ageRestriction = 'kids'
    } else if (user.userType === 'teen') {
      ageRestriction = 'teen'
    } else {
      ageRestriction = req.body.ageRestriction || 'adult'
    }

    // Parse hashtags from content
    const contentHashtags = content.match(/#[\w]+/g)?.map(tag => tag.slice(1).toLowerCase()) || []
    const allHashtags = [...new Set([...contentHashtags, ...(hashtags || [])])]

    const post = await Post.create({
      author: req.user._id,
      content,
      category: category || 'general',
      image: image || '',
      mediaUrl: mediaUrl || '',
      mediaType: mediaType || 'none',
      mediaItems: mediaItems || [],
      hashtags: allHashtags,
      ageRestriction,
      moodTags: moodTags || [],
      purposeTags: purposeTags || [],
      contentType: contentType || 'other',
    })

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name username avatar age userType')

    res.status(201).json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const likeIndex = post.likes.indexOf(req.user._id)

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1)
    } else {
      post.likes.push(req.user._id)
    }

    await post.save()
    
    // Populate author information before returning
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name username avatar age userType')
    
    res.json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add comment to post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date(),
    })

    await post.save()

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name username avatar')
      .populate('comments.user', 'name username avatar')

    res.json(updatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Increment share count
export const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.shares += 1
    await post.save()

    res.json({ message: 'Share count updated', shares: post.shares })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add interaction (reflection, choice, emotion)
export const addInteraction = async (req, res) => {
  try {
    const { type, response } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.interactions.push({
      user: req.user._id,
      type,
      response,
      timestamp: new Date(),
    })

    await post.save()
    res.json({ message: 'Interaction recorded', post })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user's own posts
export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const posts = await Post.find({ author: user._id })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })

    res.json({ posts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await post.deleteOne()
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update post
export const updatePost = async (req, res) => {
  try {
    const { content } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' })
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty' })
    }

    post.content = content
    post.updatedAt = new Date()
    await post.save()

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name username avatar')
      .populate('comments.user', 'name username avatar')

    res.json(updatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const post = await Post.findOne({ 'comments._id': commentId })

    if (!post) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const comment = post.comments.id(commentId)
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const likeIndex = comment.likes.indexOf(req.user._id)

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1)
    } else {
      comment.likes.push(req.user._id)
    }

    await post.save()

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name username avatar')
      .populate('comments.user', 'name username avatar')

    res.json(updatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}