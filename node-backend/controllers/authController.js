const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { OAuth2Client } = require('google-auth-library');

const signup = async (req, res) => {
    try {
      const { email, password, name } = req.body;
  
      // Validate required fields
      if (!email || !password || !name) {
        return res.status(400).json({
          message: 'All fields are required',
          errors: { fields: 'Email, password, and name are required' }
        });
      }
  
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        // User exists (e.g., from Google sign-in) but lacks local auth
        if (!user.hasAuthProvider('local')) {
          // Update user with local auth details, and require OTP verification.
          const hashedPassword = await bcrypt.hash(password, 12);
          user.password = hashedPassword;
          if (!user.hasAuthProvider('local')) {
            user.authProviders.push({
              provider: 'local',
              email: email,
              verified: false
            });
          }
          // Set to false so that OTP verification is required.
          user.isVerified = false;
          // Generate OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
          user.verificationOTP = { code: otp, expiresAt: otpExpiry };
          await user.save();
          // Send OTP email
          await sendVerificationEmail(email, otp);
          return res.status(201).json({
            message: 'Registration successful! Please check your email for OTP verification.',
            userId: user._id
          });
        } else {
          return res.status(400).json({
            message: 'Email already registered',
            errors: { email: 'This email is already in use' }
          });
        }
      }
  
      // If user does not exist, create a new user with local auth
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      const hashedPassword = await bcrypt.hash(password, 12);
      user = await User.create({
        email,
        password: hashedPassword,
        name,
        verificationOTP: { code: otp, expiresAt: otpExpiry },
        isVerified: false,
        authProviders: [{
          provider: 'local',
          email: email,
          verified: false
        }]
      });
      console.log("User created", user);
      await sendVerificationEmail(email, otp);
      console.log("Verification email sent");
      res.status(201).json({
        message: 'Registration successful! Please check your email for OTP verification.',
        userId: user._id
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        message: 'Registration failed',
        error: error.message
      });
    }
  };

const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (!user.verificationOTP || 
            user.verificationOTP.code !== otp || 
            user.verificationOTP.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Update user verification status
        user.isVerified = true;
        user.verificationOTP = undefined;
        await user.save();

        res.json({ 
            message: 'Email verified successfully. You can now login.',
            verified: true
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Verification failed' });
    }
};

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' } // Token expires in 24 hours
  );
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ 
                message: 'Email not verified',
                userId: user._id,
                requiresVerification: true
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const resendVerificationOTP = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.verificationOTP = {
            code: otp,
            expiresAt: otpExpiry
        };
        await user.save();

        await sendVerificationEmail(user.email, otp);

        res.json({ message: 'New OTP sent successfully' });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Error resending OTP' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.passwordResetToken = {
            token: resetToken,
            expiresAt: resetTokenExpiry
        };
        console.log(user)
        await user.save();

        await sendPasswordResetEmail(email, resetToken);

        res.json({ message: 'Password reset email sent' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required.' });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            'passwordResetToken.token': token,
            'passwordResetToken.expiresAt': { $gt: Date.now() }
        });

        console.log(user)
        if (!user) {
            // Check if user exists with this token but token is expired or missing
            const userWithToken = await User.findOne({ 'passwordResetToken.token': token });
            if (userWithToken) {
                return res.status(400).json({ message: 'Reset token expired. Please request a new password reset.' });
            }
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        // Set new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user's OTP
        user.verificationOTP = {
            code: otp,
            expiresAt: otpExpiry
        };
        await user.save();

        // Send new verification email
        await sendVerificationEmail(user.email, otp);

        res.json({ message: 'New OTP sent successfully' });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Failed to resend OTP' });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const { email, name, picture, sub: googleId } = ticket.getPayload();
        
        // Check if user exists with this email
        let user = await User.findOne({ email });
        
        if (user) {
            // User exists - handle linking
            if (!user.hasAuthProvider('google')) {
                // Link Google account to existing user
                await user.addAuthProvider('google', googleId, email, true);
                user.isVerified = true; // Google accounts are pre-verified
                if (!user.profilePicture && picture) {
                    user.profilePicture = picture;
                }
                await user.save();
            }
        } else {
            // Create new user
            const randomPassword = crypto.randomBytes(20).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 12);
            
            user = await User.create({
                email,
                name,
                password: hashedPassword,
                isVerified: true,
                profilePicture: picture,
                authProviders: [{
                    provider: 'google',
                    providerId: googleId,
                    email: email,
                    verified: true
                }]
            });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Authentication successful',
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.profilePicture,
                authProviders: user.authProviders.map(ap => ap.provider)
            },
            needsPassword: !user.password
        });

    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ message: 'Authentication failed' });
    }
};

// Add a method to set password for OAuth users
const setPassword = async (req, res) => {
    try {
        const { userId, password } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        
        if (!user.hasAuthProvider('local')) {
            await user.addAuthProvider('local', null, user.email, user.isVerified);
        }
        
        await user.save();

        res.json({ message: 'Password set successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to set password' });
    }
};

const setupLocalAuth = async (req, res) => {
    try {
        const { password } = req.body;
        
        // Password validation
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Setup local auth for the user
        await req.user.setupLocalAuth(password);
        
        res.status(200).json({ message: 'Local authentication setup successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error setting up local authentication' });
    }
};

module.exports = {
    signup,
    signin,
    verifyOTP,
    resendVerificationOTP,
    forgotPassword,
    resetPassword,
    resendOTP,
    googleAuth,
    setPassword,
    setupLocalAuth
};