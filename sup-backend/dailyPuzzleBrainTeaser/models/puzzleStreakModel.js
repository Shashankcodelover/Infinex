const mongoose = require('mongoose');

const puzzleStreakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastSolvedDate: {
      type: String, // stored as YYYY-MM-DD
      default: null
    },
    solvedPuzzles: [
      {
        puzzleId: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyPuzzle' },
        date: { type: String },
        solvedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('PuzzleStreak', puzzleStreakSchema);
