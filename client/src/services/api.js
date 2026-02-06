import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.error('Authentication error - redirecting to login')
      localStorage.removeItem('token')
      delete api.defaults.headers.common.Authorization
      window.location.href = '/login'
    } else {
      // Log other errors but don't redirect
      console.error('API Error:', error.response?.status, error.response?.data?.message || error.message)
    }
    return Promise.reject(error)
  }
)

export default api

export const fetchPosts = async (params) => {
  const res = await api.get('/posts', { params })
  return res.data
}

export const createPost = async (postData) => {
  const res = await api.post('/posts', postData)
  return res.data
}

export const likePost = async (id) => {
  const res = await api.put(`/posts/${id}/like`)
  return res.data
}

export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`)
  return res.data
}

export const fetchUserPosts = async (username) => {
  const res = await api.get(`/posts/user/${username}`)
  return res.data
}

export const updateUserProfile = async (profileData) => {
  const res = await api.put('/users/profile', profileData)
  return res.data
}

export const followUser = async (userId) => {
  const res = await api.post(`/users/${userId}/follow`)
  return res.data
}

export const unfollowUser = async (userId) => {
  const res = await api.delete(`/users/${userId}/follow`)
  return res.data
}

export const getUserFollowers = async (userId) => {
  const res = await api.get(`/users/${userId}/followers`)
  return res.data
}

export const getUserFollowing = async (userId) => {
  const res = await api.get(`/users/${userId}/following`)
  return res.data
}
