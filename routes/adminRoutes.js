import express from 'express'
import { login, downloadResume } from '../controllers/adminController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.get('/resume/:filename', protect, downloadResume)

export default router

