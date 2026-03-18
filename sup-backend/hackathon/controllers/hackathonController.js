const Hackathon = require('../models/hackathonModel');

// @desc    Create new hackathon
// @route   POST /api/hackathons
// @access  Public
const createHackathon = async (req, res) => {
  try {
    const { name, description, date, location, hostingLink } = req.body;

    if (!name || !description || !date || !location || !hostingLink) {
      return res.status(400).json({ message: "All fields including hosting link are required" });
    }

    const hackathon = await Hackathon.create({
      name,
      description,
      date,
      location,
      hostingLink,
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

// @desc    Delete a hackathon
// @route   DELETE /api/hackathons/:id
// @access  Public
const deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findByIdAndDelete(id);
    
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.json({ message: "Hackathon deleted successfully", hackathon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHackathon,
  getHackathons,
  deleteHackathon
};