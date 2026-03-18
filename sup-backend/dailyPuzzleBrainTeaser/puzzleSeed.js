const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const DailyPuzzle = require('./models/dailyPuzzleBrainTeaserModel');

const puzzles = [
  {
    question: "What is the time complexity of binary search?",
    answer: "o(log n)",
    difficulty: "easy",
    category: "DSA",
    date: "2026-03-18"
  },
  {
    question: "What will this print?\nint x = 5;\nprintf('%d', x++);",
    answer: "5",
    difficulty: "easy",
    category: "C",
    date: "2026-03-19"
  },
  {
    question: "Which SQL keyword removes duplicate rows from a result?",
    answer: "distinct",
    difficulty: "easy",
    category: "DBMS",
    date: "2026-03-20"
  },
  {
    question: "What does OOP stand for?",
    answer: "object oriented programming",
    difficulty: "easy",
    category: "Java",
    date: "2026-03-21"
  },
  {
    question: "What is the output?\nx = [1,2,3]\nprint(x[-1])",
    answer: "3",
    difficulty: "easy",
    category: "Python",
    date: "2026-03-22"
  },
  {
    question: "Which scheduling algorithm gives minimum average waiting time?",
    answer: "sjf",
    difficulty: "medium",
    category: "OS",
    date: "2026-03-23"
  },
  {
    question: "What is the full form of HTTP?",
    answer: "hypertext transfer protocol",
    difficulty: "easy",
    category: "CN",
    date: "2026-03-24"
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    let insertedCount = 0;

    for (const puzzle of puzzles) {
      const exists = await DailyPuzzle.findOne({ date: puzzle.date });
      if (exists) {
        console.log(`⚠️  Skipped (already exists): ${puzzle.date}`);
      } else {
        await DailyPuzzle.create(puzzle);
        console.log(`✅ Inserted: ${puzzle.date} — ${puzzle.category}`);
        insertedCount++;
      }
    }

    console.log(`\nSeeding complete. ${insertedCount} puzzle(s) inserted.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed ❌", error.message);
    process.exit(1);
  }
};

seed();
