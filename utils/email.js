import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

export const sendContactNotification = async (contactData) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin email
      subject: `New Contact Message from ${contactData.name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Contact notification email sent')
  } catch (error) {
    console.error('Error sending contact notification email:', error)
    // Don't throw error - email failure shouldn't break the API
  }
}

export const sendJobApplicationNotification = async (applicationData) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin email
      subject: `New Job Application: ${applicationData.position}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Name:</strong> ${applicationData.name}</p>
        <p><strong>Email:</strong> ${applicationData.email}</p>
        <p><strong>Phone:</strong> ${applicationData.phone}</p>
        <p><strong>Position:</strong> ${applicationData.position}</p>
        <p><strong>Resume:</strong> ${applicationData.resumeURL}</p>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Job application notification email sent')
  } catch (error) {
    console.error('Error sending job application notification email:', error)
    // Don't throw error - email failure shouldn't break the API
  }
}

export const sendProposalRequestNotification = async (proposalData) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin email
      subject: `New Proposal Request: ${proposalData.service}`,
      html: `
        <h2>New Proposal Request</h2>
        <p><strong>Name:</strong> ${proposalData.name}</p>
        <p><strong>Email:</strong> ${proposalData.email}</p>
        ${proposalData.phone ? `<p><strong>Phone:</strong> ${proposalData.phone}</p>` : ''}
        ${proposalData.company ? `<p><strong>Company:</strong> ${proposalData.company}</p>` : ''}
        <p><strong>Service:</strong> ${proposalData.service}</p>
        <p><strong>Message:</strong></p>
        <p>${proposalData.message}</p>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Proposal request notification email sent')
  } catch (error) {
    console.error('Error sending proposal request notification email:', error)
    // Don't throw error - email failure shouldn't break the API
  }
}

