const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'College B2B Licensing Portal' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "licenseTier": "Enterprise Campus Gold",
  "seatAllocation": 2500,
  "apiAccessStatus": "Active"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('collegeB2BLicensing', schema);
