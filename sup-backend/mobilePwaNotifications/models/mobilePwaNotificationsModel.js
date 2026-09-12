const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Mobile PWA & Push Notifications' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "pwaInstalled": true,
  "serviceWorkerRegistered": true,
  "pushDeliveryLatencyMs": 140
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('mobilePwaNotifications', schema);
