const express = require('express');
const router = express.Router();
const {
  signin,
  signup,
  verifyOTP,
  resendVerificationOTP,
  forgotPassword,
  resetPassword,
  resendOTP,
  googleAuth,
  setPassword,
  setupLocalAuth
} = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/verify-email', verifyOTP);
router.post('/resend-verification', resendVerificationOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);
router.post('/google', googleAuth);
router.post('/set-password', auth, setPassword);
router.post('/setup-local-auth', auth, setupLocalAuth);

module.exports = router;