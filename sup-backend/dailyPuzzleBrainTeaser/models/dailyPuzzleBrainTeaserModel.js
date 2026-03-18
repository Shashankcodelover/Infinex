const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String, // stored as YYYY-MM-DD for easy daily lookup
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyPuzzle', puzzleSchema);
