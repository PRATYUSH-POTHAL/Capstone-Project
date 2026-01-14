import Post from "../models/Post.js"

// @desc    Create a new post
// @route   POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { username, content } = req.body

    if (!username || !content) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const post = new Post({
      username,
      content,
    })

    const savedPost = await post.save()
    res.status(201).json(savedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all posts
// @route   GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Like a post
// @route   PUT /api/posts/:id/like
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    post.likes += 1
    await post.save()

    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
export const addComment = async (req, res) => {
  try {
    const { user, text } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    post.comments.push({ user, text })
    await post.save()

    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
