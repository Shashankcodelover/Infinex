const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  getUserProfile,
  updateUserProfile,
  getTeammateRecommendations
} = require('../controllers/profileController');

const router = express.Router();

// Multer Storage Config for profile pictures
const uploadDir = path.join(__dirname, '..', 'uploads', 'profiles');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  onError: function(err, next) {
    console.error('Multer error:', err);
    next(err);
  }
});

// Routes
router.get('/recommendations/:userId', getTeammateRecommendations);
router.get('/:userId', getUserProfile);
router.put('/:userId', upload.single('profilePicture'), updateUserProfile);

// Error handling middleware for Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  } else if (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload error: ' + err.message });
  }
  next();
});

module.exports = router;
