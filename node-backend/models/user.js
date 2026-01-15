const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      // Only require password if local auth is the ONLY provider
      return this.authProviders.length === 1 && this.authProviders[0].provider === 'local';
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  authProviders: [{
    provider: {
      type: String,
      enum: ['local', 'google'],
      required: true
    },
    providerId: String, // Store provider-specific IDs (e.g., Google ID)
    email: String,      // Provider-specific email
    verified: Boolean   // Provider-specific verification status
  }],
  profilePicture: {
    type: String
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verificationOTP: {
    code: String,
    expiresAt: Date
  },
  passwordResetToken: {
    token: { type: String },
    expiresAt: { type: Date }
  }
}, { timestamps: true });

// Add methods to handle auth providers
userSchema.methods.addAuthProvider = async function(provider, providerId, email, verified) {
  if (!this.authProviders.some(ap => ap.provider === provider)) {
    this.authProviders.push({ provider, providerId, email, verified });
    await this.save();
  }
  return this;
};

userSchema.methods.hasAuthProvider = function(provider) {
  return this.authProviders.some(ap => ap.provider === provider);
};

// Add a method to set up local authentication
userSchema.methods.setupLocalAuth = async function(password) {
  if (!this.hasAuthProvider('local')) {
    const hashedPassword = await bcrypt.hash(password, 10);
    this.password = hashedPassword;
    this.authProviders.push({
      provider: 'local',
      email: this.email,
      verified: true  // Since they're already verified through Google
    });
    await this.save();
  }
  return this;
};

// Add password verification method
userSchema.methods.verifyPassword = async function(password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
