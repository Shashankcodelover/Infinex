const express = require('express');
const {
  getTodayPuzzle,
  submitAnswer,
  getUserStreak,
  createPuzzle
} = require('../controllers/dailyPuzzleBrainTeaserController');

const router = express.Router();

router.get('/today', getTodayPuzzle);
router.post('/submit', submitAnswer);
router.get('/streak/:userId', getUserStreak);
router.post('/', createPuzzle);

module.exports = router;
