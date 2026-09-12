const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'College Battle Leagues' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "currentRank": 3,
  "eloRating": 2145,
  "nextMatch": "Infinex Inter-State Derby in 2 days"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('collegeBattleLeagues', schema);
