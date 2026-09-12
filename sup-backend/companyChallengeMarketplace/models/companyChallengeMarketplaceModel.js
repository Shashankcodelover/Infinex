const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Company Challenge Marketplace' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "verifiedChallenges": 18,
  "activeBountySum": "$45,000 USD",
  "directInterviewFastTrack": true
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('companyChallengeMarketplace', schema);
