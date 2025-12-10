const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true, // Adds created_at and updated_at automatically
});

// Index for faster queries
noteSchema.index({ user_id: 1, created_at: -1 });

module.exports = mongoose.model('Note', noteSchema);

