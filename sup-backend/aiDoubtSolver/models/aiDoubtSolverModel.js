const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'AI Doubt Solver' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "explanation": "Optimal substructure detected. Use a bottom-up memoization table with O(N) space complexity.",
  "confidence": 98,
  "recommendedLinks": [
    "https://neetcode.io",
    "https://cp-algorithms.com"
  ]
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('aiDoubtSolver', schema);
