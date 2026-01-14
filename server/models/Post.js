import mongoose from "mongoose"

const commentSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const postSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
)

const Post = mongoose.model("Post", postSchema)
export default Post
