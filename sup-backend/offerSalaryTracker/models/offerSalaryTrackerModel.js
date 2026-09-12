const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Offer & Salary Tracker' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "medianCampusCTC": "18.5 LPA",
  "topOfferCTC": "54 LPA",
  "verifiedOffersLogged": 1240
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('offerSalaryTracker', schema);
