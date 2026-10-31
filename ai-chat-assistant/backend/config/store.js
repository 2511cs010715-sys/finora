const mongoose = require('mongoose');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const { getDBStatus } = require('./db');

// In-memory collections for zero-setup fallback
const memoryDB = {
  users: [],
  conversations: [],
  messages: [],
};

const generateId = () => new mongoose.Types.ObjectId().toString();

const DataStore = {
  // User operations
  async createUser({ name, email, password }) {
    if (getDBStatus()) {
      return await User.create({ name, email, password });
    }
    const existing = memoryDB.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err = new Error('User already exists with this email address');
      err.status = 400;
      throw err;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = {
      _id: generateId(),
      id: undefined,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
      matchPassword: async function (entered) {
        return await bcrypt.compare(entered, this.password);
      },
    };
    user.id = user._id;
    memoryDB.users.push(user);
    return user;
  },

  async findUserByEmail(email) {
    if (getDBStatus()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memoryDB.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (getDBStatus()) {
      return await User.findById(id).select('-password');
    }
    const user = memoryDB.users.find((u) => u._id.toString() === id.toString() || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  // Conversation operations
  async getConversationsByUser(userId) {
    if (getDBStatus()) {
      return await Conversation.find({ user_id: userId }).sort({ updated_at: -1 });
    }
    return memoryDB.conversations
      .filter((c) => c.user_id.toString() === userId.toString())
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  },

  async getConversationById(id, userId) {
    if (getDBStatus()) {
      return await Conversation.findOne({ _id: id, user_id: userId });
    }
    return memoryDB.conversations.find(
      (c) => (c._id.toString() === id.toString() || c.id === id) && c.user_id.toString() === userId.toString()
    ) || null;
  },

  async createConversation({ userId, title = 'New Conversation', model = 'gpt-4o-mini' }) {
    if (getDBStatus()) {
      return await Conversation.create({ user_id: userId, title, model });
    }
    const conv = {
      _id: generateId(),
      id: undefined,
      user_id: userId,
      title,
      model,
      created_at: new Date(),
      updated_at: new Date(),
    };
    conv.id = conv._id;
    memoryDB.conversations.unshift(conv);
    return conv;
  },

  async updateConversationTitle(id, userId, title) {
    if (getDBStatus()) {
      return await Conversation.findOneAndUpdate(
        { _id: id, user_id: userId },
        { title, updated_at: new Date() },
        { new: true }
      );
    }
    const conv = memoryDB.conversations.find(
      (c) => (c._id.toString() === id.toString() || c.id === id) && c.user_id.toString() === userId.toString()
    );
    if (conv) {
      conv.title = title;
      conv.updated_at = new Date();
    }
    return conv;
  },

  async deleteConversation(id, userId) {
    if (getDBStatus()) {
      await Message.deleteMany({ conversation_id: id });
      return await Conversation.findOneAndDelete({ _id: id, user_id: userId });
    }
    const convIdx = memoryDB.conversations.findIndex(
      (c) => (c._id.toString() === id.toString() || c.id === id) && c.user_id.toString() === userId.toString()
    );
    if (convIdx !== -1) {
      const removed = memoryDB.conversations.splice(convIdx, 1)[0];
      memoryDB.messages = memoryDB.messages.filter(
        (m) => m.conversation_id.toString() !== id.toString() && m.conversation_id !== id
      );
      return removed;
    }
    return null;
  },

  // Message operations
  async getMessagesByConversation(conversationId) {
    if (getDBStatus()) {
      return await Message.find({ conversation_id: conversationId }).sort({ created_at: 1 });
    }
    return memoryDB.messages
      .filter((m) => m.conversation_id.toString() === conversationId.toString())
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  async createMessage({ conversationId, role, content }) {
    if (getDBStatus()) {
      const msg = await Message.create({ conversation_id: conversationId, role, content });
      await Conversation.findByIdAndUpdate(conversationId, { updated_at: new Date() });
      return msg;
    }
    const msg = {
      _id: generateId(),
      id: undefined,
      conversation_id: conversationId,
      role,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    };
    msg.id = msg._id;
    memoryDB.messages.push(msg);

    const conv = memoryDB.conversations.find(
      (c) => c._id.toString() === conversationId.toString() || c.id === conversationId
    );
    if (conv) {
      conv.updated_at = new Date();
    }
    return msg;
  },

  async deleteMessage(messageId, userId) {
    if (getDBStatus()) {
      return await Message.findByIdAndDelete(messageId);
    }
    const idx = memoryDB.messages.findIndex(
      (m) => m._id.toString() === messageId.toString() || m.id === messageId
    );
    if (idx !== -1) {
      return memoryDB.messages.splice(idx, 1)[0];
    }
    return null;
  },
};

module.exports = DataStore;
