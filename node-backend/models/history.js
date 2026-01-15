const mongoose = require('mongoose')

// Check if model already exists before compiling
const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    cloudinaryId: {
        type: String,
      },
    result: {
        predictedClass: {
            type: String,
            required: true
        },severity: {
            type: String,
        },
        // confidence: {
        //     type: Number,
        //     required: true
        // }
    },
    feedback: {
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comment: {
          type: String,
        },
        time: {
          type: Date,
          default: Date.now
        }
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

module.exports = mongoose.model('History', historySchema)