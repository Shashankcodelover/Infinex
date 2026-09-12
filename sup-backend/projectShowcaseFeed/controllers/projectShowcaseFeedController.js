const Model = require('../models/projectShowcaseFeedModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Project Showcase Feed',
      data: payload,
      response: {
  "upvotes": 248,
  "communityRanking": "Top 10 of the Week",
  "featuredBadge": true
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Project Showcase Feed processed successfully',
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
      module: 'Project Showcase Feed',
      active: true,
      capabilities: {
  "upvotes": 248,
  "communityRanking": "Top 10 of the Week",
  "featuredBadge": true
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
