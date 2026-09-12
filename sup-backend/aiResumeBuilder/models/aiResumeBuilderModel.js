const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'AI Resume Builder & ATS Scanner' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "atsScore": 94,
  "bulletRecommendations": [
    "Quantified scale impact: \"Reduced p99 tail latency from 450ms to 42ms\""
  ],
  "keywordDensity": "Excellent (9.2% matching Fortune 500 tech rubrics)"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('aiResumeBuilder', schema);
