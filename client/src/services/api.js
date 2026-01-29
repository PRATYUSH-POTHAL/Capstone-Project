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
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
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