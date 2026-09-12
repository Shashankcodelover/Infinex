const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Placement Skill Gap Analyzer' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "compatibilityScore": "81%",
  "criticalGaps": [
    "Distributed Caching (Redis/Memcached)",
    "Kafka Consumer Group Rebalancing"
  ],
  "estimatedDaysToBridge": 12
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('placementSkillGapAnalyzer', schema);
