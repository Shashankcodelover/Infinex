const Model = require('../models/collegeB2BLicensingModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'College B2B Licensing Portal',
      data: payload,
      response: {
  "licenseTier": "Enterprise Campus Gold",
  "seatAllocation": 2500,
  "apiAccessStatus": "Active"
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'College B2B Licensing Portal processed successfully',
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
      module: 'College B2B Licensing Portal',
      active: true,
      capabilities: {
  "licenseTier": "Enterprise Campus Gold",
  "seatAllocation": 2500,
  "apiAccessStatus": "Active"
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
