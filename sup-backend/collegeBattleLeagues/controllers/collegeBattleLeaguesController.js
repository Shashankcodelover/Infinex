const Model = require('../models/collegeBattleLeaguesModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'College Battle Leagues',
      data: payload,
      response: {
  "currentRank": 3,
  "eloRating": 2145,
  "nextMatch": "Infinex Inter-State Derby in 2 days"
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'College Battle Leagues processed successfully',
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
      module: 'College Battle Leagues',
      active: true,
      capabilities: {
  "currentRank": 3,
  "eloRating": 2145,
  "nextMatch": "Infinex Inter-State Derby in 2 days"
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
