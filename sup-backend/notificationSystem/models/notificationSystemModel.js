const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Central Notification Stream' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "unreadCount": 3,
  "lastSyncTimestamp": "2026-09-12T05:09:36.198Z"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('notificationSystem', schema);
