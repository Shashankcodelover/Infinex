const express = require('express');
const router = express.Router();
const controller = require('../controllers/offlineModeSyncController');

router.get('/', controller.getStatus);
router.post('/action', controller.handleAction);

module.exports = router;
