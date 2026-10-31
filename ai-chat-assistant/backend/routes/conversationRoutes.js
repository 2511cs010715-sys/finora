const express = require('express');
const router = express.Router();
const DataStore = require('../config/store');
const { protect } = require('../middleware/authMiddleware');

// All conversation routes are protected
router.use(protect);

/**
 * @route   GET /api/conversations
 * @desc    Get all conversations for the authenticated user
 * @access  Private
 */
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const conversations = await DataStore.getConversationsByUser(userId);

    res.json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/conversations
 * @desc    Create a new empty conversation
 * @access  Private
 */
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { title = 'New Chat', model = 'gpt-4o-mini' } = req.body;

    const conversation = await DataStore.createConversation({
      userId,
      title,
      model,
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/conversations/:id
 * @desc    Get conversation details and all associated messages
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const conversationId = req.params.id;

    const conversation = await DataStore.getConversationById(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied',
      });
    }

    const messages = await DataStore.getMessagesByConversation(conversationId);

    res.json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PATCH /api/conversations/:id (or PUT)
 * @desc    Update conversation title
 * @access  Private
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const conversationId = req.params.id;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid conversation title',
      });
    }

    const updated = await DataStore.updateConversationTitle(conversationId, userId, title.trim());
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied',
      });
    }

    res.json({
      success: true,
      conversation: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const conversationId = req.params.id;
    const { title } = req.body;

    const updated = await DataStore.updateConversationTitle(conversationId, userId, title?.trim() || 'New Chat');
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied',
      });
    }

    res.json({
      success: true,
      conversation: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/conversations/:id
 * @desc    Delete a conversation and all its messages
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const conversationId = req.params.id;

    const deleted = await DataStore.deleteConversation(conversationId, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied',
      });
    }

    res.json({
      success: true,
      message: 'Conversation and messages deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
