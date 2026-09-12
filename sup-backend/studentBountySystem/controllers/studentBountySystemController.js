const Model = require('../models/studentBountySystemModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Student Open Source Bounty System',
      data: payload,
      response: {
  "bountyId": "BNT-9042",
  "escrowLocked": true,
  "status": "Open for Claim"
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Student Open Source Bounty System processed successfully',
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
      module: 'Student Open Source Bounty System',
      active: true,
      capabilities: {
  "bountyId": "BNT-9042",
  "escrowLocked": true,
  "status": "Open for Claim"
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
