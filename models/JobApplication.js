import mongoose from 'mongoose'

const jobApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  resumeURL: {
    type: String,
    required: [true, 'Resume is required']
  }
}, {
  timestamps: true
})

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema)

export default JobApplication

