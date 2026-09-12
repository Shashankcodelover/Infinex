const Model = require('../models/liveCodingRoomsModel');

const handleAction = async (req, res) => {
  try {
    const payload = req.body || {};
    const entry = await Model.create({
      title: 'Live Collaborative Coding Rooms',
      data: payload,
      response: {
  "roomCode": "INF-ROOM-8821",
  "compilerStatus": "WASM V8 Engine Ready",
  "activeParticipants": 4
},
      status: 'processed'
    });
    res.status(201).json({
      success: true,
      message: 'Live Collaborative Coding Rooms processed successfully',
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
      module: 'Live Collaborative Coding Rooms',
      active: true,
      capabilities: {
  "roomCode": "INF-ROOM-8821",
  "compilerStatus": "WASM V8 Engine Ready",
  "activeParticipants": 4
},
      history: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { handleAction, getStatus };
