const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Peer Tutoring Marketplace' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "activeTutorsOnline": 32,
  "satisfactionScore": "4.9 / 5.0"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('peerTutoringMarketplace', schema);
