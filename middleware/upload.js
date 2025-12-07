import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
// Use /tmp for serverless environments, or project directory for traditional deployments
const getUploadsDir = () => {
  // Check if we're in a serverless environment (Vercel, Railway, etc.)
  if (process.env.VERCEL || process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
    // Use /tmp for serverless (temporary storage)
    const tmpDir = '/tmp/uploads'
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true })
      }
      return tmpDir
    } catch (error) {
      console.warn('Failed to create /tmp/uploads, falling back to project directory:', error.message)
    }
  }
  
  // Fallback to project directory
  const uploadsDir = path.join(__dirname, '../uploads')
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    return uploadsDir
  } catch (error) {
    console.error('Failed to create uploads directory:', error.message)
    // Last resort: use current working directory
    const fallbackDir = path.join(process.cwd(), 'uploads')
    try {
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true })
      }
      return fallbackDir
    } catch (fallbackError) {
      console.error('Failed to create fallback uploads directory:', fallbackError.message)
      throw new Error('Unable to create uploads directory. Please check file system permissions.')
    }
  }
}

const uploadsDir = getUploadsDir()
console.log('📁 Uploads directory:', uploadsDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists before saving
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      cb(null, uploadsDir)
    } catch (error) {
      console.error('Error accessing uploads directory:', error.message)
      cb(new Error('Upload directory not accessible'), null)
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx']
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
})

export default upload

