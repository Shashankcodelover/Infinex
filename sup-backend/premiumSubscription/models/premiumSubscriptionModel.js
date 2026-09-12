const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Infinex PRO Subscription' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "membershipStatus": "PRO Active",
  "perksUnlocked": [
    "Zero-Wait AI Doubt Solver",
    "Unlimited Live Coding Rooms",
    "Direct Recruiter Referrals"
  ]
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('premiumSubscription', schema);
