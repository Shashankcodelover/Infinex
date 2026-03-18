const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  isGroup: { type: Boolean, default: false },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
