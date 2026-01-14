import PostCard from "./PostCard"
import useFetchPosts from "../hooks/useFetchPosts"

const Feed = () => {
  const { posts, loading } = useFetchPosts()

  if (loading) return <p className="text-center">Loading feed...</p>

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Feed
