const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  createHackathon,
  getHackathons,
  deleteHackathon
} = require('../controllers/hackathonController');

const router = express.Router();

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
router.post('/', upload.single('logo'), createHackathon);
router.get('/', getHackathons);
router.delete('/:id', deleteHackathon);

module.exports = router;