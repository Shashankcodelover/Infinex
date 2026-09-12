const Model = require('../models/aiDoubtSolverModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'AI Doubt Solver',
      data: payload,
      response: {
  "explanation": "Optimal substructure detected. Use a bottom-up memoization table with O(N) space complexity.",
  "confidence": 98,
  "recommendedLinks": [
    "https://neetcode.io",
    "https://cp-algorithms.com"
  ]
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'AI Doubt Solver processed successfully',
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
      module: 'AI Doubt Solver',
      active: true,
      capabilities: {
  "explanation": "Optimal substructure detected. Use a bottom-up memoization table with O(N) space complexity.",
  "confidence": 98,
  "recommendedLinks": [
    "https://neetcode.io",
    "https://cp-algorithms.com"
  ]
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
