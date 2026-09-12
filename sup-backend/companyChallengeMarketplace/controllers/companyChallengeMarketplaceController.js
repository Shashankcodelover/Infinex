const Model = require('../models/companyChallengeMarketplaceModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Company Challenge Marketplace',
      data: payload,
      response: {
  "verifiedChallenges": 18,
  "activeBountySum": "$45,000 USD",
  "directInterviewFastTrack": true
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Company Challenge Marketplace processed successfully',
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
      module: 'Company Challenge Marketplace',
      active: true,
      capabilities: {
  "verifiedChallenges": 18,
  "activeBountySum": "$45,000 USD",
  "directInterviewFastTrack": true
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
