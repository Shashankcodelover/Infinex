const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Live Collaborative Coding Rooms' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "roomCode": "INF-ROOM-8821",
  "compilerStatus": "WASM V8 Engine Ready",
  "activeParticipants": 4
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('liveCodingRooms', schema);
