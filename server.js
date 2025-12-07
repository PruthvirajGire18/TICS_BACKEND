import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import connectDB, { isConnected } from './config/database.js'
import AdminUser from './models/AdminUser.js'

// Import routes
import contactRoutes from './routes/contactRoutes.js'
import careersRoutes from './routes/careersRoutes.js'
import servicesRoutes from './routes/servicesRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { getContactMessages } from './controllers/contactController.js'
import { getJobApplications } from './controllers/careersController.js'
import { protect } from './middleware/auth.js'

// Load env vars
dotenv.config()

const app = express()

// Connect to database (async, won't block server start)
connectDB().catch((err) => {
  console.error('Database connection failed:', err.message)
})

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/contact', contactRoutes)
app.use('/api/careers', careersRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/admin', adminRoutes)

// Admin dashboard routes (protected)
app.get('/api/admin/contacts', protect, getContactMessages)
app.get('/api/admin/applications', protect, getJobApplications)

// Initialize admin user if it doesn't exist
const initializeAdmin = async () => {
  // Wait for database connection
  let retries = 0
  const maxRetries = 15
  
  while (!isConnected && mongoose.connection.readyState !== 1 && retries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    retries++
    if (retries % 3 === 0) {
      console.log(`   Waiting for MongoDB connection... (${retries}/${maxRetries})`)
    }
  }

  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️  Database not connected. Admin initialization skipped.')
    console.warn('   Admin will be created automatically when database connects.')
    console.warn('   Server will continue running, but database features will not work.')
    return
  }

  try {
    const adminExists = await AdminUser.findOne()
    if (!adminExists) {
      const admin = await AdminUser.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      })
      console.log('✅ Admin user created:', admin.username)
    } else {
      console.log('✅ Admin user already exists')
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message)
    if (error.message.includes('buffering')) {
      console.error('   Database connection timeout. Check your MONGODB_URI in .env file.')
    }
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TICS API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
  console.log(`\n⚠️  Note: If MongoDB is not connected, some features may not work.`)
  console.log(`   Check your MONGODB_URI in server/.env file\n`)
  
  // Initialize admin after a short delay to allow DB connection
  setTimeout(async () => {
    await initializeAdmin()
  }, 2000)
})

export default app

