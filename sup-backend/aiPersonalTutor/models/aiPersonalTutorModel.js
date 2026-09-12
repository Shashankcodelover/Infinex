const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'AI Personal Tutor' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "generatedRoadmap": [
    "Week 1: Graph Traversal & Topological Sort",
    "Week 2: Segment Trees & Fenwick",
    "Week 3: Concurrency Primitives"
  ],
  "recommendedPracticeCount": 42
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('aiPersonalTutor', schema);
