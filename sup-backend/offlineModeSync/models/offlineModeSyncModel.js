const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Offline Sync & IndexedDB Engine' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "storageEngine": "IndexedDB + CRDT LWW-Register",
  "syncStatus": "Fully Synced (0 pending conflicts)"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('offlineModeSync', schema);
