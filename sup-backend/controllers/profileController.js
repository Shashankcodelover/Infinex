const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/profile/:userId
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/:userId
// @access  Public
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
    }

    let { name, state, bio, skills, languages, domains, experience, github, portfolio } = req.body;

    console.log('updateUserProfile called for', userId, 'body', req.body, 'file', req.file && req.file.path);

    // form-data may send JSON strings for arrays
    const parseArrayField = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try {
        return JSON.parse(val);
      } catch (e) {
        // fall back to comma split
        return String(val).split(',').map(s => s.trim()).filter(s => s);
      }
    };

    skills = parseArrayField(skills);
    languages = parseArrayField(languages);
    domains = parseArrayField(domains);

    let updateData = {
      name,
      state,
      bio,
      skills,
      languages,
      domains,
      experience,
      github,
      portfolio
    };

    // remove undefined values so existing fields are not overwritten
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    if (req.file) {
      // verify file exists before saving path
      if (fs.existsSync(req.file.path)) {
        // Save relative path from project root for static file serving
        // req.file.path is absolute, we need it relative to uploads folder
        const relativePath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
        updateData.profilePicture = relativePath;
        console.log('Profile picture saved at:', relativePath);
      } else {
        console.warn('Uploaded file does not exist at', req.file.path);
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended teammates based on skills
// @route   GET /api/profile/recommendations/:userId
// @access  Public
const getTeammateRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { domain } = req.query;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let query = { _id: { $ne: userId } };

    // If domain is specified, filter by domain
    if (domain) {
      query.domains = domain;
    }

    const recommendations = await User.find(query)
      .select('-password')
      .limit(10);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getTeammateRecommendations
};
