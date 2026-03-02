const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const multer = require('multer');

// configure storage for chat attachments
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/chat/');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/conversation', chatController.getOrCreateConversation);
// allow up to 5 attachments per message
router.post('/message', upload.array('attachments', 5), chatController.postMessage);
router.get('/conversation/:conversationId/messages', chatController.getMessages);
// list conversations for a user
router.get('/conversations/user/:userId', chatController.getUserConversations);

module.exports = router;
