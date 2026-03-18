const User = require('../models/userModel');

// @desc    Find user by email
// @route   GET /api/users/search
// @access  Public
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter required' });
    }

    const user = await User.findOne({ email }).select('_id name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserByEmail };
