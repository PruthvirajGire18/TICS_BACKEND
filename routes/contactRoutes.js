import express from 'express'
import { submitContact, getContactMessages } from '../controllers/contactController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', submitContact)
router.get('/admin', protect, getContactMessages)

export default router

