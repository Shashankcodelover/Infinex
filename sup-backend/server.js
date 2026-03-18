const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// ensure upload directories exist
const fs = require('fs');
['uploads', 'uploads/profiles', 'uploads/chat'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send("Backend Server Running 🚀");
});

const PORT = process.env.PORT || 5000;

const hackathonRoutes = require('./hackathon/routes/hackathonRoutes');
const authRoutes = require('./auth/routes/authRoutes');
const profileRoutes = require('./profile/routes/profileRoutes');
const teamRoutes = require('./team/routes/teamRoutes');
const chatRoutes = require('./chat/routes/chatRoutes');
const userRoutes = require('./user/routes/userRoutes');
const dailyPuzzleRoutes = require('./dailyPuzzleBrainTeaser/routes/dailyPuzzleBrainTeaserRoutes');

app.use('/uploads', express.static('uploads'));
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/daily-puzzle', dailyPuzzleRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});