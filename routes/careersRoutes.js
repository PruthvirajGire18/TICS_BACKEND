import express from 'express'
import { getJobs, applyJob, getJobApplications } from '../controllers/careersController.js'
import { protect } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.get('/jobs', getJobs)
router.post('/apply', upload.single('resume'), applyJob)
router.get('/applications', protect, getJobApplications)

export default router

