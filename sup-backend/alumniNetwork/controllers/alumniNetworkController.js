const Model = require('../models/alumniNetworkModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Alumni Network & Mentorship',
      data: payload,
      response: {
  "matchedMentors": 5,
  "upcomingAMA": "Tech Lead @ Google Bangalore — Saturday 6:00 PM IST",
  "referralReadiness": "High"
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Alumni Network & Mentorship processed successfully',
      data: entry
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getStatus = async (req, res) => {
  try {
    const list = await Model.find().sort({ createdAt: -1 }).limit(10);
    res.json({
      module: 'Alumni Network & Mentorship',
      active: true,
      capabilities: {
  "matchedMentors": 5,
  "upcomingAMA": "Tech Lead @ Google Bangalore — Saturday 6:00 PM IST",
  "referralReadiness": "High"
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
