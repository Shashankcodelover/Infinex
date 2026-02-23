const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send("Backend Server Running 🚀");
});

const PORT = process.env.PORT || 5000;

const hackathonRoutes = require('./routes/hackathonRoutes');

app.use('/uploads', express.static('uploads'));
app.use('/api/hackathons', hackathonRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});