const History = require('../models/history');
const cloudinary = require('../config/cloudinary');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const safeUnlink = async (path) => {
  try {
    await unlinkAsync(path);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Failed to delete temp file:', err);
    }
  }
};

const recommendations=[
  {
    "category": "DR",
    "recommendations": [
      "You may have signs of diabetic retinopathy. Schedule an urgent ophthalmic evaluation with a retina specialist for confirmation and staging.",
      "Ensure tight control of blood glucose, blood pressure, and lipids, as these factors significantly impact DR progression.",
    ]
  },
  {
    "category": "Glaucoma",
    "recommendations": [
      "Do not delay: untreated glaucoma can lead to irreversible optic nerve damage and vision loss.",
      "Encourage close follow-up with an ophthalmologist even if no symptoms are present, as glaucoma is often asymptomatic in early stages."
    ]
  },
  {
    "category": "Normal",
    "recommendations": [
      "Your fundus image appears normal. However, this does not rule out all eye diseases. Maintain routine annual eye checkups.",
      "Continue healthy lifestyle habits: manage blood pressure, glucose levels, and avoid smoking to protect ocular health.",
      "In the presence of any visual symptoms (blurring, floaters, field loss), seek immediate ophthalmologic evaluation despite a normal image."
    ]
  }
]


const uploadImage = async (req, res) => {
  let response;
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Create form data for FastAPI
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Send to FastAPI for prediction
    const apiResponse = await axios.post(
      'http://127.0.0.1:8000/upload',
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    // Handle validation or image errors from FastAPI
    if (apiResponse.data.message && !apiResponse.data.predicted_class) {
      await safeUnlink(req.file.path); // 🔁 Clean temp file
      return res.status(400).json({
        message: apiResponse.data.message
      });
    }

    // ✅ If response is successful, upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'opti-guard',
      resource_type: 'image'
    });

    // Delete temp file after cloudinary upload
    await safeUnlink(req.file.path);

    // Save to history
    const history = new History({
      userId: req.user._id,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      result: {
        predictedClass: apiResponse.data.predicted_class,
        // Optional field (if present)
        severity: apiResponse.data.severity || null,
      },
      feedback:null
    });

    await history.save();

    res.status(200).json({
      message: 'Image uploaded and analyzed successfully',
      // Return the saved history (optional)
      history: {
        id: history._id,
        imageUrl: history.imageUrl,
        result: history.result,
        createdAt: history.createdAt
      },
      recommendations: recommendations.find(rec => rec.category === apiResponse.data.predicted_class)?.recommendations || []
    });

  } catch (error) {
    await safeUnlink(req.file?.path); // Clean temp file on error

    if (error.response) {
      // FastAPI error handling
      return res.status(error.response.status).json({
        message: error.response.data.message || 'Image rejected by FastAPI'
      });
    } else {
      console.error('Internal Server Error:', error); // Log error for debugging
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message || 'Unknown error'
      });
    }
  }
};

// Get user history
const getUserHistory = async (req, res) => {
  console.log(req.user);
  try {
    const history = await History.find({ userId: req.user._id }).sort({ createdAt: -1 });
    console.log(history);
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
};

// Add feedback to history item
const addFeedback = async (req, res) => {
  try {
    const { historyId, rating, comment } = req.body;
    
    if (!historyId || !rating) {
      return res.status(400).json({ message: 'History ID and rating are required' });
    }

    const history = await History.findById(historyId);
    
    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }
    
    if (history.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this history' });
    }

    history.feedback = {
      rating,
      comment: comment || '',
      createdAt: new Date()
    };

    await history.save();
    
    res.status(200).json({ 
      message: 'Feedback added successfully',
      history
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add feedback', error: error.message });
  }
};

const clearHistory = async (req, res) => {
  const { historyId } = req.query; // Optional query param for specific deletion

  try {
    if (historyId) {
      // 🔹 Delete a specific history entry
      const history = await History.findOne({ _id: historyId, userId: req.user._id });
      if (!history) {
        return res.status(404).json({ message: 'History not found or unauthorized' });
      }

      // ❌ Delete image from Cloudinary
      if (history.cloudinaryId) {
        await cloudinary.uploader.destroy(history.cloudinaryId);
      }

      await History.deleteOne({ _id: historyId });
      return res.status(200).json({ message: 'History item deleted successfully' });

    } else {
      // 🔸 Delete all history entries for the user
      const histories = await History.find({ userId: req.user._id });

      for (const item of histories) {
        if (item.cloudinaryId) {
          await cloudinary.uploader.destroy(item.cloudinaryId);
        }
      }

      await History.deleteMany({ userId: req.user._id });
      return res.status(200).json({ message: 'All history cleared successfully' });
    }

  } catch (error) {
    console.error('Error clearing history:', error);
    return res.status(500).json({ message: 'Failed to clear history', error: error.message });
  }
};


module.exports = {
  uploadImage,
  getUserHistory,
  addFeedback,
  clearHistory
};