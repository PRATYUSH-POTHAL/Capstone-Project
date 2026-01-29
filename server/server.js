import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requireDb } from './middleware/requireDb.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/auth', requireDb, authRoutes)
app.use('/api/posts', requireDb, postRoutes)
app.use('/api/users', requireDb, userRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
  } catch {
    // If Mongo connection fails with a real URI, crash fast so it’s obvious.
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startServer()