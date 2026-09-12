const express = require('express');
const router = express.Router();
const controller = require('../controllers/companyChallengeMarketplaceController');

router.get('/', controller.getStatus);
router.post('/action', controller.handleAction);

module.exports = router;
