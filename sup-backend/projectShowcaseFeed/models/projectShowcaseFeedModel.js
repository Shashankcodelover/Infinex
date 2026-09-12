const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Project Showcase Feed' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "upvotes": 248,
  "communityRanking": "Top 10 of the Week",
  "featuredBadge": true
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('projectShowcaseFeed', schema);
