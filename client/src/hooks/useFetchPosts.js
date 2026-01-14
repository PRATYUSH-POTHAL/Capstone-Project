import { useEffect, useState } from "react"
import { fetchPosts } from "../services/api"

const useFetchPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts()
      setPosts(data)
      setLoading(false)
    }
    getPosts()
  }, [])

  return { posts, setPosts, loading }
}

export default useFetchPosts
