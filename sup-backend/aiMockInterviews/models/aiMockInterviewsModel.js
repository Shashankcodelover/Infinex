const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'AI Mock Interviews' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "openingQuestion": "How would you architect a globally distributed rate limiter with 99.999% availability?",
  "durationMinutes": 45,
  "rubricWeights": {
    "firstPrinciples": 30,
    "tradeOffs": 30,
    "communication": 40
  }
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('aiMockInterviews', schema);
