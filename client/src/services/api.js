const BASE_URL = "http://localhost:5000/api/posts"

export const fetchPosts = async () => {
  const res = await fetch(BASE_URL)
  return res.json()
}

export const createPost = async (postData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
  return res.json()
}

export const likePost = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/like`, {
    method: "PUT",
  })
  return res.json()
}

export const addComment = async (id, commentData) => {
  const res = await fetch(`${BASE_URL}/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  })
  return res.json()
}
