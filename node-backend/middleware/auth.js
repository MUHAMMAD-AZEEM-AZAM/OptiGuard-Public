const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'No authentication token, authorization denied',
                needsLogin: true 
            });
        }

        const token = authHeader.replace('Bearer ', '');
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.userId });
            
            if (!user) {
                throw new Error('User not found');
            }

            // Check if OTP verification is required and not completed
            if (user.otp && user.otp.code && !req.path.includes('/verify-otp')) {
                return res.status(403).json({ 
                    message: 'OTP verification required',
                    requiresOTP: true 
                });
            }

            req.user = user;
            req.token = token;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    message: 'Token has expired',
                    tokenExpired: true
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            message: 'Authentication failed',
            needsLogin: true
        });
    }
};

module.exports = auth; 