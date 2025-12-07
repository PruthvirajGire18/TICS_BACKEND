import express from 'express'
import { requestProposal } from '../controllers/servicesController.js'

const router = express.Router()

router.post('/proposal', requestProposal)

export default router

