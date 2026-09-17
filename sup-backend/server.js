const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const campusTopology = require('./campusTopologyService');

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
app.use(express.text({ type: ['text/*', 'application/csv', 'text/csv'], limit: '15mb' }));
app.use(express.static(path.join(__dirname, '../sup-frontend')));

// Test Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../sup-frontend/dashboard/dashboard.html'));
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

// Mount 21 Innovation Hub AI & Platform modules
const extraModules = [
  'aiDoubtSolver', 'aiMockInterviews', 'aiPersonalTutor', 'aiResumeBuilder',
  'alumniNetwork', 'collegeB2BLicensing', 'collegeBattleLeagues', 'companyChallengeMarketplace',
  'liveCodingRooms', 'mobilePwaNotifications', 'notificationSystem', 'offerSalaryTracker',
  'offlineModeSync', 'parentFacultyDashboard', 'peerTutoringMarketplace', 'placementSkillGapAnalyzer',
  'premiumSubscription', 'projectShowcaseFeed', 'referralNetwork', 'regionalLanguageSupport',
  'studentBountySystem'
];

extraModules.forEach(mod => {
  try {
    const route = require(`./${mod}/routes/${mod}Routes`);
    app.use(`/api/${mod}`, route);
  } catch (err) {
    console.error(`Failed to mount /api/${mod}:`, err.message);
  }
});

// =========================================================================
// Enterprise Collegiate Relational Topology & Batch Ingestion Endpoints
// =========================================================================

// Telemetry & Metrics
app.get('/api/topology/telemetry', (req, res) => {
  res.json(campusTopology.getTelemetry());
});

// Corridors CRUD & 1-Click Sever
app.get('/api/topology/corridors', (req, res) => {
  res.json(campusTopology.getAllCorridors());
});

app.post('/api/topology/corridors', (req, res) => {
  try {
    const corridor = campusTopology.createCorridor(req.body);
    res.status(201).json(corridor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/topology/corridors/:id/sever', (req, res) => {
  try {
    const corridor = campusTopology.severCorridor(req.params.id);
    res.json({ success: true, corridor, telemetry: campusTopology.getTelemetry() });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.post('/api/topology/corridors/:id/restore', (req, res) => {
  try {
    const corridor = campusTopology.restoreCorridor(req.params.id);
    res.json({ success: true, corridor, telemetry: campusTopology.getTelemetry() });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.delete('/api/topology/corridors/:id', (req, res) => {
  const result = campusTopology.deleteCorridor(req.params.id);
  if (!result.deleted) return res.status(404).json({ error: 'Corridor not found' });
  res.json({ success: true, corridorId: req.params.id, telemetry: campusTopology.getTelemetry() });
});

// Universal corridor purge
app.delete('/api/topology/corridors', (req, res) => {
  const result = campusTopology.purgeAllCorridors();
  res.json({ success: true, ...result, telemetry: campusTopology.getTelemetry() });
});

// High-Throughput Batch Ingestion for Corridors
app.post('/api/topology/corridors/upload', (req, res) => {
  try {
    const format = req.query.format || 'auto';
    const payload = req.body;
    const result = campusTopology.ingestCorridorsBatch(payload, format);
    res.json({ ...result, telemetry: campusTopology.getTelemetry() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Squads CRUD & Cascading Deletion
app.get('/api/topology/squads', (req, res) => {
  res.json(campusTopology.getAllSquads());
});

app.post('/api/topology/squads', (req, res) => {
  try {
    const squad = campusTopology.createSquad(req.body);
    res.status(201).json(squad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/topology/squads/:id', (req, res) => {
  const result = campusTopology.deleteSquad(req.params.id);
  if (!result.deleted) return res.status(404).json({ error: result.message });
  res.json({ success: true, ...result, telemetry: campusTopology.getTelemetry() });
});

// Universal squad & cascading corridor purge
app.delete('/api/topology/squads', (req, res) => {
  const result = campusTopology.purgeAllSquads();
  res.json({ success: true, ...result, telemetry: campusTopology.getTelemetry() });
});

// High-Throughput Batch Ingestion for Squads
app.post('/api/topology/squads/upload', (req, res) => {
  try {
    const format = req.query.format || 'auto';
    const payload = req.body;
    const result = campusTopology.ingestSquadsBatch(payload, format);
    res.json({ ...result, telemetry: campusTopology.getTelemetry() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reset defaults
app.post('/api/topology/reset', (req, res) => {
  campusTopology.resetTopologyDefaults();
  res.json({ success: true, telemetry: campusTopology.getTelemetry() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mounted 28 total API modules (7 core + 21 AI modules + Collegiate Topology Mesh) ✅`);
});
