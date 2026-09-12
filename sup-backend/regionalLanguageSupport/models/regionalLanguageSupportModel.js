const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Regional Language AI Audio Engine' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "synthesizedAudioStream": "Active (Multilingual Neural Voice)",
  "accuracyRating": "99.4% technical lexicon fidelity"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('regionalLanguageSupport', schema);
