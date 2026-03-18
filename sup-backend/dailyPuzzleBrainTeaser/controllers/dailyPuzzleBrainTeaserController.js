const DailyPuzzle = require('../models/dailyPuzzleBrainTeaserModel');
const PuzzleStreak = require('../models/puzzleStreakModel');

// Helper: get today's date as YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split('T')[0];

// @desc    Get today's puzzle
// @route   GET /api/daily-puzzle/today
// @access  Public
const getTodayPuzzle = async (req, res) => {
  try {
    const today = getTodayDate();
    const puzzle = await DailyPuzzle.findOne({ date: today });

    if (!puzzle) {
      return res.status(404).json({ message: "No puzzle found for today" });
    }

    // Return puzzle without the answer
    const { answer, ...puzzleData } = puzzle.toObject();
    res.json(puzzleData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an answer for today's puzzle
// @route   POST /api/daily-puzzle/submit
// @access  Public
const submitAnswer = async (req, res) => {
  try {
    const { userId, answer } = req.body;

    if (!userId || !answer) {
      return res.status(400).json({ message: "userId and answer are required" });
    }

    const today = getTodayDate();
    const puzzle = await DailyPuzzle.findOne({ date: today });

    if (!puzzle) {
      return res.status(404).json({ message: "No puzzle found for today" });
    }

    const isCorrect = puzzle.answer.trim().toLowerCase() === answer.trim().toLowerCase();

    if (!isCorrect) {
      return res.json({ correct: false, message: "Wrong answer, try again!" });
    }

    // Update streak
    let streak = await PuzzleStreak.findOne({ userId });

    if (!streak) {
      streak = new PuzzleStreak({ userId });
    }

    // Check if already solved today
    const alreadySolved = streak.solvedPuzzles.some(p => p.date === today);
    if (alreadySolved) {
      return res.json({ correct: true, message: "Already solved today's puzzle", streak });
    }

    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastSolvedDate === yesterdayStr) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastSolvedDate = today;
    streak.solvedPuzzles.push({ puzzleId: puzzle._id, date: today });

    await streak.save();

    res.json({ correct: true, message: "Correct answer!", streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's puzzle streak
// @route   GET /api/daily-puzzle/streak/:userId
// @access  Public
const getUserStreak = async (req, res) => {
  try {
    const { userId } = req.params;

    const streak = await PuzzleStreak.findOne({ userId });

    if (!streak) {
      return res.json({ currentStreak: 0, longestStreak: 0, solvedPuzzles: [] });
    }

    res.json(streak);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new puzzle (admin use)
// @route   POST /api/daily-puzzle
// @access  Public
const createPuzzle = async (req, res) => {
  try {
    const { question, answer, difficulty, category, date } = req.body;

    if (!question || !answer || !difficulty || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await DailyPuzzle.findOne({ date });
    if (existing) {
      return res.status(400).json({ message: "A puzzle already exists for this date" });
    }

    const puzzle = await DailyPuzzle.create({ question, answer, difficulty, category, date });
    res.status(201).json(puzzle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTodayPuzzle,
  submitAnswer,
  getUserStreak,
  createPuzzle
};
