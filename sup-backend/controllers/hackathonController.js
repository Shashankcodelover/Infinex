const Hackathon = require('../models/hackathonModel');

// @desc    Create new hackathon
// @route   POST /api/hackathons
// @access  Public
const createHackathon = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;

    if (!name || !description || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hackathon = await Hackathon.create({
      name,
      description,
      date,
      location,
      logo: req.file ? req.file.path : null
    });

    res.status(201).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public
const getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHackathon,
  getHackathons
};