import express from 'express'
import { register, login, getMe, updateMoodAndIntent, resetPassword } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/reset-password', resetPassword)
router.get('/me', protect, getMe)
router.put('/mood-intent', protect, updateMoodAndIntent)

export default router