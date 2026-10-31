const express = require('express');
const router = express.Router();
const DataStore = require('../config/store');
const aiService = require('../services/aiService');
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimiter');

// All chat routes require authentication
router.use(protect);

/**
 * @route   POST /api/chat
 * @desc    Send a prompt, get AI completion, store both in DB
 * @access  Private
 */
router.post('/', chatLimiter, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { prompt, conversation_id, model = 'gpt-4o-mini', system_prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Prompt cannot be empty.',
      });
    }

    let conversation;
    let isNewConversation = false;

    // Retrieve or create conversation
    if (conversation_id) {
      conversation = await DataStore.getConversationById(conversation_id, userId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found or access denied',
        });
      }
    } else {
      // Auto-generate title from first prompt
      const generatedTitle = await aiService.generateTitle(prompt);
      conversation = await DataStore.createConversation({
        userId,
        title: generatedTitle,
        model,
      });
      isNewConversation = true;
    }

    const currentConvId = conversation._id || conversation.id;

    // Save user message to database
    const userMessage = await DataStore.createMessage({
      conversationId: currentConvId,
      role: 'user',
      content: prompt.trim(),
    });

    // Fetch conversation history for context awareness
    const historyMessages = await DataStore.getMessagesByConversation(currentConvId);

    // Build message array for AI model (system prompt + history)
    const aiContext = [];
    if (system_prompt) {
      aiContext.push({ role: 'system', content: system_prompt });
    } else {
      aiContext.push({
        role: 'system',
        content:
          'You are a helpful, brilliant, concise, and structured AI Chat Assistant. Format your responses with clean Markdown, bullet points, headers, and code blocks with language identifiers where appropriate.',
      });
    }

    // Append history messages
    historyMessages.forEach((msg) => {
      aiContext.push({ role: msg.role, content: msg.content });
    });

    // Call AI Service
    const aiResult = await aiService.generateResponse(aiContext, model);

    // Save AI response to database
    const assistantMessage = await DataStore.createMessage({
      conversationId: currentConvId,
      role: 'assistant',
      content: aiResult.content,
    });

    // If conversation was existing but had default title, update title if this is the first message
    if (!isNewConversation && historyMessages.length <= 2 && conversation.title === 'New Chat') {
      const generatedTitle = await aiService.generateTitle(prompt);
      await DataStore.updateConversationTitle(currentConvId, userId, generatedTitle);
      conversation.title = generatedTitle;
    }

    res.json({
      success: true,
      conversation_id: currentConvId,
      conversation,
      user_message: userMessage,
      assistant_message: assistantMessage,
      model: aiResult.model,
      provider: aiResult.provider,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/chat/regenerate
 * @desc    Regenerate AI response for the last user message in a conversation
 * @access  Private
 */
router.post('/regenerate', chatLimiter, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { conversation_id, model = 'gpt-4o-mini' } = req.body;

    if (!conversation_id) {
      return res.status(400).json({ success: false, message: 'Conversation ID is required' });
    }

    const conversation = await DataStore.getConversationById(conversation_id, userId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const currentConvId = conversation._id || conversation.id;
    const messages = await DataStore.getMessagesByConversation(currentConvId);

    if (messages.length === 0) {
      return res.status(400).json({ success: false, message: 'No messages to regenerate from' });
    }

    // Build context up to the last user message
    const aiContext = [
      {
        role: 'system',
        content: 'You are a helpful, brilliant, concise, and structured AI Assistant. Format responses in Markdown.',
      },
    ];

    messages.forEach((msg) => {
      aiContext.push({ role: msg.role, content: msg.content });
    });

    // If last message is assistant, remove it from context so AI generates a fresh take
    if (aiContext[aiContext.length - 1].role === 'assistant') {
      aiContext.pop();
    }

    const aiResult = await aiService.generateResponse(aiContext, model);

    const assistantMessage = await DataStore.createMessage({
      conversationId: currentConvId,
      role: 'assistant',
      content: aiResult.content,
    });

    res.json({
      success: true,
      conversation_id: currentConvId,
      assistant_message: assistantMessage,
      model: aiResult.model,
      provider: aiResult.provider,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete a specific message
 * @access  Private
 */
router.delete('/messages/:id', async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const messageId = req.params.id;

    const deleted = await DataStore.deleteMessage(messageId, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or already removed',
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
