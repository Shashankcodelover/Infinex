const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../controllers/userController');

// search user by email
router.get('/search', getUserByEmail);

module.exports = router;
