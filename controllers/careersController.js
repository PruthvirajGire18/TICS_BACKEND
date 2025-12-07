import Job from '../models/Job.js'
import JobApplication from '../models/JobApplication.js'
import { sendJobApplicationNotification } from '../utils/email.js'

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 })
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    })
  }
}

export const applyJob = async (req, res) => {
  try {
    const { name, email, phone, position } = req.body
    const resumeFile = req.file

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      })
    }

    const application = await JobApplication.create({
      name,
      email,
      phone,
      position,
      resumeURL: resumeFile.filename
    })

    // Send email notification (non-blocking)
    sendJobApplicationNotification({
      name,
      email,
      phone,
      position,
      resumeURL: resumeFile.filename
    }).catch(console.error)

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully',
      data: application
    })
  } catch (error) {
    console.error('Error submitting job application:', error)
    res.status(500).json({
      success: false,
      message: 'Error submitting job application',
      error: error.message
    })
  }
}

export const getJobApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 })
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    })
  } catch (error) {
    console.error('Error fetching job applications:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching job applications',
      error: error.message
    })
  }
}

