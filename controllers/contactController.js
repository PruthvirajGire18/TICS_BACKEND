import ContactMessage from '../models/ContactMessage.js'
import { sendContactNotification } from '../utils/email.js'

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message
    })

    // Send email notification (non-blocking)
    sendContactNotification({ name, email, phone, message }).catch(console.error)

    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: contactMessage
    })
  } catch (error) {
    console.error('Error submitting contact:', error)
    res.status(500).json({
      success: false,
      message: 'Error submitting contact message',
      error: error.message
    })
  }
}

export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages',
      error: error.message
    })
  }
}

