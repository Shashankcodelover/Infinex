const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, default: 'Parent & Faculty Oversight Portal' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  response: { type: mongoose.Schema.Types.Mixed, default: {
  "overallProgress": "94%",
  "attendanceRate": "98.2%",
  "placementReadinessRating": "Grade A (Top 5% Cohort)"
} },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('parentFacultyDashboard', schema);
