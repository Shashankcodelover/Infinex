const Model = require('../models/premiumSubscriptionModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Infinex PRO Subscription',
      data: payload,
      response: {
  "membershipStatus": "PRO Active",
  "perksUnlocked": [
    "Zero-Wait AI Doubt Solver",
    "Unlimited Live Coding Rooms",
    "Direct Recruiter Referrals"
  ]
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Infinex PRO Subscription processed successfully',
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
      module: 'Infinex PRO Subscription',
      active: true,
      capabilities: {
  "membershipStatus": "PRO Active",
  "perksUnlocked": [
    "Zero-Wait AI Doubt Solver",
    "Unlimited Live Coding Rooms",
    "Direct Recruiter Referrals"
  ]
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
