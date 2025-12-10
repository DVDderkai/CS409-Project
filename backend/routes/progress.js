const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const ReviewPlan = require('../models/ReviewPlan');
const { protect } = require('../middleware/auth');

// @route   GET /api/progress
// @desc    Get user's study progress
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all notes
    const totalNotes = await Note.countDocuments({ user_id: userId });

    // Get review plans statistics
    const totalReviews = await ReviewPlan.countDocuments({ user_id: userId });
    const completedReviews = await ReviewPlan.countDocuments({
      user_id: userId,
      status: 'completed',
    });
    const pendingReviews = await ReviewPlan.countDocuments({
      user_id: userId,
      status: 'pending',
    });
    const overdueReviews = await ReviewPlan.countDocuments({
      user_id: userId,
      status: 'overdue',
    });

    // Get upcoming reviews (next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const upcomingReviews = await ReviewPlan.countDocuments({
      user_id: userId,
      review_date: { $lte: sevenDaysFromNow },
      status: { $in: ['pending', 'overdue'] },
    });

    // Calculate completion rate
    const completionRate = totalReviews > 0
      ? Math.round((completedReviews / totalReviews) * 100)
      : 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentNotes = await Note.countDocuments({
      user_id: userId,
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        notes: {
          total: totalNotes,
          recent: recentNotes,
        },
        reviews: {
          total: totalReviews,
          completed: completedReviews,
          pending: pendingReviews,
          overdue: overdueReviews,
          upcoming: upcomingReviews,
          completionRate,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

