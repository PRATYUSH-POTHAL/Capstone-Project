const PostCard = ({ post }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">{post.username}</h3>
      <p className="my-2">{post.content}</p>
      <p className="text-sm text-gray-500">
        ❤️ {post.likes} likes
      </p>
    </div>
  )
}

export default PostCard
