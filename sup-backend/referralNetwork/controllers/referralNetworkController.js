const Model = require('../models/referralNetworkModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Direct Referral Network',
      data: payload,
      response: {
  "referralVouchersAvailable": 3,
  "partnerCompanies": [
    "Google",
    "Microsoft",
    "Stripe",
    "Rippling",
    "Swiggy"
  ]
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Direct Referral Network processed successfully',
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
      module: 'Direct Referral Network',
      active: true,
      capabilities: {
  "referralVouchersAvailable": 3,
  "partnerCompanies": [
    "Google",
    "Microsoft",
    "Stripe",
    "Rippling",
    "Swiggy"
  ]
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
