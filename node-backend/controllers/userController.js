const { sendContactUsEmail, sendFeedbackEmail } = require('../utils/emailService');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

const contactUs = async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user; // From auth middleware
    console.log(user);
    console.log(message);

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    await sendContactUsEmail(user.name, user.email, message);

    res.json({
      success: true,
      message: 'Your message has been sent successfully'
    });
  } catch (error) {
    console.error('Contact us error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { rating, message } = req.body;
    const user = req.user;

    if (!rating || !message) {
      return res.status(400).json({
        success: false,
        message: 'Rating and message are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Save feedback to database
    const feedback = new Feedback({
      user: user._id,
      rating,
      message
    });
    await feedback.save();

    // Send email notification
    await sendFeedbackEmail(user.email, rating, message);

    res.json({
      success: true,
      message: 'Thank you for your feedback',
      feedback: {
        id: feedback._id,
        rating,
        message,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
};

module.exports = {
  contactUs,
  submitFeedback
};
