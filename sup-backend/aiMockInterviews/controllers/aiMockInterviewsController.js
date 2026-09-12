const Model = require('../models/aiMockInterviewsModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'AI Mock Interviews',
      data: payload,
      response: {
  "openingQuestion": "How would you architect a globally distributed rate limiter with 99.999% availability?",
  "durationMinutes": 45,
  "rubricWeights": {
    "firstPrinciples": 30,
    "tradeOffs": 30,
    "communication": 40
  }
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'AI Mock Interviews processed successfully',
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
      module: 'AI Mock Interviews',
      active: true,
      capabilities: {
  "openingQuestion": "How would you architect a globally distributed rate limiter with 99.999% availability?",
  "durationMinutes": 45,
  "rubricWeights": {
    "firstPrinciples": 30,
    "tradeOffs": 30,
    "communication": 40
  }
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
