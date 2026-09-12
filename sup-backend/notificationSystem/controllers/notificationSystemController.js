const Model = require('../models/notificationSystemModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Central Notification Stream',
      data: payload,
      response: {
  "unreadCount": 3,
  "lastSyncTimestamp": "2026-09-12T05:09:36.198Z"
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Central Notification Stream processed successfully',
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
      module: 'Central Notification Stream',
      active: true,
      capabilities: {
  "unreadCount": 3,
  "lastSyncTimestamp": "2026-09-12T05:09:36.198Z"
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
