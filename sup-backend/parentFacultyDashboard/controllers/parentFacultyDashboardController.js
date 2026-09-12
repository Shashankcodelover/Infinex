const Model = require('../models/parentFacultyDashboardModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Parent & Faculty Oversight Portal',
      data: payload,
      response: {
  "overallProgress": "94%",
  "attendanceRate": "98.2%",
  "placementReadinessRating": "Grade A (Top 5% Cohort)"
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Parent & Faculty Oversight Portal processed successfully',
      data: entry
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getStatus = async (req, res) => {
  try {
    const list = await Model.find().sort({ createdAt: -1 }).limit(10);
    res.json({
      module: 'Parent & Faculty Oversight Portal',
      active: true,
      capabilities: {
  "overallProgress": "94%",
  "attendanceRate": "98.2%",
  "placementReadinessRating": "Grade A (Top 5% Cohort)"
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
