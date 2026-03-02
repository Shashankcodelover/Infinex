const express = require('express');

const {
  createTeam,
  getTeams,
  getTeamById,
  sendTeamInvite,
  acceptTeamInvite,
  rejectTeamInvite,
  removeTeamMember,
  getUserTeams
} = require('../controllers/teamController');

const router = express.Router();

// Team routes
router.post('/', createTeam);
router.get('/user/:userId', getUserTeams);
router.get('/:teamId', getTeamById);
router.get('/', getTeams);

// Invite routes
router.post('/:teamId/invite/:userId', sendTeamInvite);
router.post('/:teamId/accept/:userId', acceptTeamInvite);
router.post('/:teamId/reject/:userId', rejectTeamInvite);

// Member management
router.delete('/:teamId/members/:userId', removeTeamMember);

module.exports = router;
