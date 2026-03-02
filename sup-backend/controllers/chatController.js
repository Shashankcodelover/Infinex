const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');

// Create or get 1:1 conversation
const getOrCreateConversation = async (req, res) => {
  try {
    const { userIds, name, isGroup } = req.body; // userIds: array of user ids

    if (!Array.isArray(userIds) || userIds.length < 2) {
      return res.status(400).json({ message: 'At least two userIds required' });
    }

    // For group conversations, always create new
    if (isGroup) {
      const conv = await Conversation.create({ name: name || 'Group', isGroup: true, members: userIds });
      return res.status(201).json(conv);
    }

    // For 1:1, try to find existing conversation with same two members
    const conv = await Conversation.findOne({
      isGroup: false,
      members: { $size: 2, $all: userIds }
    });

    if (conv) return res.json(conv);

    const newConv = await Conversation.create({ members: userIds, isGroup: false });
    res.status(201).json(newConv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Post message
const postMessage = async (req, res) => {
  try {
        const { conversationId, senderId, text } = req.body;

    if (!conversationId || !senderId) {
      return res.status(400).json({ message: 'conversationId and senderId required' });
    }

    let attachments = [];
    if (req.files && req.files.length) {
      attachments = req.files.map(f => {
        // store relative path for client to fetch via /uploads
        return f.path.replace('\\', '/');
      });
    }

    const message = await Message.create({ conversation: conversationId, sender: senderId, text: text || '', attachments });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for conversation (pagination optional)
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) return res.status(400).json({ message: 'conversationId required' });

    const messages = await Message.find({ conversation: conversationId }).populate('sender', 'name email profilePicture').sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all conversations for a user
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const convs = await Conversation.find({ members: userId });
    res.json(convs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrCreateConversation, postMessage, getMessages, getUserConversations };
