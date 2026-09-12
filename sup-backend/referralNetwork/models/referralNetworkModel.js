const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Direct Referral Network' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "referralVouchersAvailable": 3,
  "partnerCompanies": [
    "Google",
    "Microsoft",
    "Stripe",
    "Rippling",
    "Swiggy"
  ]
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('referralNetwork', schema);
