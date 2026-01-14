import express from "express"
import {
  createPost,
  getPosts,
  likePost,
  addComment,
} from "../controllers/postController.js"

const router = express.Router()

router.post("/", createPost)
router.get("/", getPosts)
router.put("/:id/like", likePost)
router.post("/:id/comment", addComment)

export default router
