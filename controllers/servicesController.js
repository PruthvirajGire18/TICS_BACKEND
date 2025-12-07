import { sendProposalRequestNotification } from '../utils/email.js'

export const requestProposal = async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body

    // Send email notification (non-blocking)
    sendProposalRequestNotification({
      name,
      email,
      phone,
      company,
      service,
      message
    }).catch(console.error)

    res.status(200).json({
      success: true,
      message: 'Proposal request submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting proposal request:', error)
    res.status(500).json({
      success: false,
      message: 'Error submitting proposal request',
      error: error.message
    })
  }
}

