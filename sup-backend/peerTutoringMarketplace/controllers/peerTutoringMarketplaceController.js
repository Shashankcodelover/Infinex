const Model = require('../models/peerTutoringMarketplaceModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Peer Tutoring Marketplace',
      data: payload,
      response: {
  "activeTutorsOnline": 32,
  "satisfactionScore": "4.9 / 5.0"
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Peer Tutoring Marketplace processed successfully',
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
      module: 'Peer Tutoring Marketplace',
      active: true,
      capabilities: {
  "activeTutorsOnline": 32,
  "satisfactionScore": "4.9 / 5.0"
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
