import { useEffect, useState } from "react"
import api from "../services/api"

const useFetchPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await api.get('/posts')
        // Handle both array and object response
        const postsData = response.data.posts || response.data || []
        setPosts(postsData)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    getPosts()
  }, [])

  return { posts, setPosts, loading }
}

export default useFetchPosts
