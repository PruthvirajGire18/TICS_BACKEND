import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Job from '../models/Job.js'
import connectDB from '../config/database.js'

dotenv.config()

const jobs = [
  {
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote / New York, NY',
    type: 'Full-time',
    description: 'We are looking for an experienced Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: [
      '5+ years of experience in web development',
      'Proficiency in React, Node.js, and MongoDB',
      'Strong problem-solving skills',
      'Experience with cloud platforms (AWS/Azure)',
      'Excellent communication skills'
    ],
    isActive: true
  },
  {
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Join our design team to create beautiful and intuitive user experiences. You will work closely with developers and product managers to bring designs to life.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma, Adobe XD',
      'Strong portfolio showcasing design skills',
      'Understanding of user research methodologies',
      'Knowledge of design systems'
    ],
    isActive: true
  },
  {
    title: 'Cloud Solutions Architect',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design and implement scalable cloud infrastructure solutions. You will work with clients to migrate and optimize their cloud environments.',
    requirements: [
      '7+ years of cloud architecture experience',
      'Expertise in AWS, Azure, or GCP',
      'Kubernetes and Docker experience',
      'Strong understanding of DevOps practices',
      'Certifications preferred (AWS Solutions Architect, etc.)'
    ],
    isActive: true
  },
  {
    title: 'Cybersecurity Specialist',
    department: 'Security',
    location: 'Remote / Boston, MA',
    type: 'Full-time',
    description: 'Protect our clients\' systems and data from cyber threats. Conduct security audits, implement security measures, and respond to incidents.',
    requirements: [
      '5+ years of cybersecurity experience',
      'Knowledge of security frameworks (OWASP, NIST)',
      'Experience with penetration testing',
      'Certifications (CISSP, CEH, etc.) preferred',
      'Strong analytical skills'
    ],
    isActive: true
  },
  {
    title: 'Mobile App Developer',
    department: 'Engineering',
    location: 'Austin, TX',
    type: 'Full-time',
    description: 'Develop native and cross-platform mobile applications for iOS and Android. Work on exciting projects that reach millions of users.',
    requirements: [
      '4+ years of mobile development experience',
      'Proficiency in React Native or Flutter',
      'Experience with native iOS/Android development',
      'Strong understanding of mobile UI/UX',
      'Published apps in App Store/Play Store'
    ],
    isActive: true
  }
]

const seed = async () => {
  try {
    await connectDB()
    console.log('Connected to database')
    
    // Clear existing jobs
    await Job.deleteMany({})
    console.log('Cleared existing jobs')
    
    // Insert new jobs
    await Job.insertMany(jobs)
    console.log(`Successfully seeded ${jobs.length} jobs`)
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding jobs:', error)
    process.exit(1)
  }
}

seed()

