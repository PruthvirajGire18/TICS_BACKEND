import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { createServer } from 'net'
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

// Get uploads directory with fallback
const getUploadsDir = () => {
  if (process.env.VERCEL || process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
    const tmpDir = '/tmp/uploads'
    if (fs.existsSync(tmpDir)) {
      return tmpDir
    }
  }
  const uploadsDir = path.join(__dirname, 'uploads')
  if (fs.existsSync(uploadsDir)) {
    return uploadsDir
  }
  return path.join(process.cwd(), 'uploads')
}

// Only serve static files if directory exists
const uploadsDir = getUploadsDir()
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir))
  console.log('📁 Serving uploads from:', uploadsDir)
} else {
  console.warn('⚠️  Uploads directory not found, static file serving disabled')
}

// Handle favicon.ico requests (prevent 500 errors)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end()
})

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'TICS Backend API',
    status: 'running',
    version: '1.0.0'
  })
})

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

// Helper function to check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = createServer()
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false)
      } else {
        resolve(false)
      }
    })
    server.once('listening', () => {
      server.once('close', () => resolve(true))
      server.close()
    })
    server.listen(port)
  })
}

// Helper function to find available port
const findAvailablePort = async (startPort) => {
  for (let port = startPort; port <= startPort + 10; port++) {
    if (await isPortAvailable(port)) {
      return port
    }
  }
  return null
}

const startServer = async () => {
  let PORT = process.env.PORT || 5000
  
  // Check if port is available
  const portAvailable = await isPortAvailable(PORT)
  
  if (!portAvailable) {
    console.warn(`⚠️  Port ${PORT} is already in use!`)
    console.log(`   Searching for an available port...`)
    
    const availablePort = await findAvailablePort(parseInt(PORT) + 1)
    
    if (availablePort) {
      PORT = availablePort
      console.log(`   ✅ Found available port: ${PORT}`)
      console.log(`   💡 To use a specific port, stop the process using port ${process.env.PORT || 5000}`)
      console.log(`      Windows: netstat -ano | findstr :${process.env.PORT || 5000}`)
      console.log(`      Then: taskkill /PID <PID> /F\n`)
    } else {
      console.error(`\n❌ Error: Could not find an available port!`)
      console.error(`\n💡 Solutions:`)
      console.error(`   1. Find and stop the process using port ${process.env.PORT || 5000}:`)
      console.error(`      Windows: netstat -ano | findstr :${process.env.PORT || 5000}`)
      console.error(`      Then: taskkill /PID <PID> /F`)
      console.error(`   2. Use a different port by setting PORT in .env file`)
      console.error(`      Example: PORT=5001`)
      console.error(`   3. Or change the port in server/.env file\n`)
      process.exit(1)
    }
  }

  const server = app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📡 API available at http://localhost:${PORT}/api`)
    console.log(`\n⚠️  Note: If MongoDB is not connected, some features may not work.`)
    console.log(`   Check your MONGODB_URI in server/.env file\n`)
    
    // Initialize admin after a short delay to allow DB connection
    setTimeout(async () => {
      await initializeAdmin()
    }, 2000)
  })

  // Handle other server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${PORT} is already in use!`)
      console.error(`   This shouldn't happen if port checking worked.`)
      process.exit(1)
    } else {
      console.error('❌ Server error:', error)
      process.exit(1)
    }
  })
}

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})

export default app

