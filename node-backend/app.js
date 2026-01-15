// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const upload = require('./routes/uploadRouter');
const auth = require('./routes/authRouter');
const user =require('./routes/userRouter')
const { verifyEmailConfig } = require('./utils/emailService');
const historyRoutes = require('./routes/historyRoutes');
const userRouter = require('./routes/userRouter');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000','https://opti-guard.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5000;

// MongoDB connection
const startServer = async () => {
  try {
    // Verify MongoDB connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Verify email service
    const emailServiceReady = await verifyEmailConfig();
    if (!emailServiceReady) {
      console.warn('Warning: Email service is not configured properly');
    }

    // Routes
    app.use('/upload', upload);
    app.use('/auth', auth);
    app.use('/user',userRouter)
    app.use('/api/history', historyRoutes);

    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    const uploadDir = './uploads/temp';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();

