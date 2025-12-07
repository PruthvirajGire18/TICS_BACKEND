import jwt from 'jsonwebtoken'
import AdminUser from '../models/AdminUser.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      })
    }

    const admin = await AdminUser.findOne({ username: username.toLowerCase() })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const isMatch = await admin.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const token = generateToken(admin._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    })
  } catch (error) {
    console.error('Error in admin login:', error)
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    })
  }
}

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const downloadResume = async (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(__dirname, '../uploads', filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err)
        res.status(500).json({
          success: false,
          message: 'Error downloading file'
        })
      }
    })
  } catch (error) {
    console.error('Error in download resume:', error)
    res.status(500).json({
      success: false,
      message: 'Error downloading resume',
      error: error.message
    })
  }
}

