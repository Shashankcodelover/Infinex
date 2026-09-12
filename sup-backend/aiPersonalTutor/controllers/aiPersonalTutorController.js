const Model = require('../models/aiPersonalTutorModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'AI Personal Tutor',
      data: payload,
      response: {
  "generatedRoadmap": [
    "Week 1: Graph Traversal & Topological Sort",
    "Week 2: Segment Trees & Fenwick",
    "Week 3: Concurrency Primitives"
  ],
  "recommendedPracticeCount": 42
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'AI Personal Tutor processed successfully',
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
      module: 'AI Personal Tutor',
      active: true,
      capabilities: {
  "generatedRoadmap": [
    "Week 1: Graph Traversal & Topological Sort",
    "Week 2: Segment Trees & Fenwick",
    "Week 3: Concurrency Primitives"
  ],
  "recommendedPracticeCount": 42
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
