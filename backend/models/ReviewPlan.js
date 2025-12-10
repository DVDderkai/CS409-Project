const mongoose = require('mongoose');

const reviewPlanSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  note_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true,
  }],
  review_date: {
    type: Date,
    required: [true, 'Please provide a review date'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue'],
    default: 'pending',
  },
}, {
  timestamps: true, // Adds created_at and updated_at automatically
});

// Index for faster queries
reviewPlanSchema.index({ user_id: 1, review_date: 1 });
reviewPlanSchema.index({ review_date: 1, status: 1 });

module.exports = mongoose.model('ReviewPlan', reviewPlanSchema);

