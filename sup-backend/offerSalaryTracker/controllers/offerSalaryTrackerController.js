const Model = require('../models/offerSalaryTrackerModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Offer & Salary Tracker',
      data: payload,
      response: {
  "medianCampusCTC": "18.5 LPA",
  "topOfferCTC": "54 LPA",
  "verifiedOffersLogged": 1240
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Offer & Salary Tracker processed successfully',
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
      module: 'Offer & Salary Tracker',
      active: true,
      capabilities: {
  "medianCampusCTC": "18.5 LPA",
  "topOfferCTC": "54 LPA",
  "verifiedOffersLogged": 1240
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
