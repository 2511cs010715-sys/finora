const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    model: {
      type: String,
      default: 'gpt-4o-mini',
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Conversation', conversationSchema);
