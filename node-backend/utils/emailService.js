const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    secure: true,
  });


const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};

const sendVerificationEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"OptiGuard verification service"`,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: `"OptiGuard email service" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const sendUserFeedbackEmail = async (username, userEmail, message) => {
  try {
    const mailOptions = {
      from: `"OptiGuard User" <${userEmail}>`,
      to: process.env.EMAIL_USER,
      subject: `Feedback from ${username}`,
      html: `
        <h2>New User Feedback</h2>
        <p><strong>From:</strong> ${username} (${userEmail})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><small>Sent via OptiGuard Feedback System</small></p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Feedback email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Feedback email error:', error);
    throw error;
  }
};

const sendContactUsEmail = async (username, userEmail, message) => {
  try {
    const mailOptions = {
      from: `"OptiGuard Contact" <${userEmail}>`,
      to: process.env.EMAIL_USER,
      subject: `Contact Us Message from ${username}`,
      html: `
        <h2>New Contact Us Message</h2>
        <p><strong>From:</strong> ${username}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><small>Sent via OptiGuard Contact Us Form</small></p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact us email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Contact us email error:', error);
    throw error;
  }
};

const sendFeedbackEmail = async (userEmail, rating, message) => {
  try {
    const mailOptions = {
      from: `"OptiGuard Feedback" <${userEmail}>`,
      to: process.env.EMAIL_USER,
      subject: `New User Feedback - ${rating} Stars`,
      html: `
        <h2>New User Feedback</h2>
        <p><strong>From:</strong> ${userEmail}</p>
        <p><strong>Rating:</strong> ${rating} Stars</p>
        <p><strong>Feedback:</strong></p>
        <p>${message}</p>
        <p><small>Sent via OptiGuard Feedback System</small></p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Feedback email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Feedback email error:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  verifyEmailConfig,
  sendUserFeedbackEmail,
  sendContactUsEmail,
  sendFeedbackEmail
}; 