const multer = require('multer');
const express = require('express');
const auth = require('../middleware/auth');
const { uploadImage } = require("../controllers/historyController");

// Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/temp');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      console.log("This is image file")
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/',auth, upload.single('image'),uploadImage)

module.exports = router;
