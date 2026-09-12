const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Alumni Network & Mentorship' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "matchedMentors": 5,
  "upcomingAMA": "Tech Lead @ Google Bangalore — Saturday 6:00 PM IST",
  "referralReadiness": "High"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('alumniNetwork', schema);
