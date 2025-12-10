const express = require('express');
const router = express.Router();
const ReviewPlan = require('../models/ReviewPlan');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// @route   GET /api/review-plan
// @desc    Get all review plans for authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reviewPlans = await ReviewPlan.find({ user_id: req.user._id })
      .populate('note_ids', 'title content tags')
      .sort({ review_date: 1 });

    // Update status for overdue reviews
    const now = new Date();
    for (let plan of reviewPlans) {
      if (plan.status === 'pending' && plan.review_date < now) {
        plan.status = 'overdue';
        await plan.save();
      }
    }

    res.status(200).json({
      success: true,
      count: reviewPlans.length,
      data: reviewPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/review-plan/:id
// @desc    Get single review plan
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const reviewPlan = await ReviewPlan.findById(req.params.id)
      .populate('note_ids', 'title content tags');

    if (!reviewPlan) {
      return res.status(404).json({
        success: false,
        error: 'Review plan not found',
      });
    }

    // Make sure review plan belongs to user
    if (reviewPlan.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this review plan',
      });
    }

    res.status(200).json({
      success: true,
      data: reviewPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   POST /api/review-plan
// @desc    Create new review plan
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { note_ids, review_date } = req.body;

    if (!note_ids || !Array.isArray(note_ids) || note_ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one note ID',
      });
    }

    if (!review_date) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a review date',
      });
    }

    // Verify all notes belong to user
    const notes = await Note.find({
      _id: { $in: note_ids },
      user_id: req.user._id,
    });

    if (notes.length !== note_ids.length) {
      return res.status(400).json({
        success: false,
        error: 'Some notes do not exist or do not belong to you',
      });
    }

    const reviewPlan = await ReviewPlan.create({
      user_id: req.user._id,
      note_ids,
      review_date: new Date(review_date),
      status: 'pending',
    });

    const populatedPlan = await ReviewPlan.findById(reviewPlan._id)
      .populate('note_ids', 'title content tags');

    res.status(201).json({
      success: true,
      data: populatedPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   PUT /api/review-plan/:id
// @desc    Update review plan
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let reviewPlan = await ReviewPlan.findById(req.params.id);

    if (!reviewPlan) {
      return res.status(404).json({
        success: false,
        error: 'Review plan not found',
      });
    }

    // Make sure review plan belongs to user
    if (reviewPlan.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review plan',
      });
    }

    // If updating note_ids, verify they belong to user
    if (req.body.note_ids) {
      const notes = await Note.find({
        _id: { $in: req.body.note_ids },
        user_id: req.user._id,
      });

      if (notes.length !== req.body.note_ids.length) {
        return res.status(400).json({
          success: false,
          error: 'Some notes do not exist or do not belong to you',
        });
      }
    }

    // If updating review_date, convert to Date
    if (req.body.review_date) {
      req.body.review_date = new Date(req.body.review_date);
    }

    reviewPlan = await ReviewPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('note_ids', 'title content tags');

    res.status(200).json({
      success: true,
      data: reviewPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   DELETE /api/review-plan/:id
// @desc    Delete review plan
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reviewPlan = await ReviewPlan.findById(req.params.id);

    if (!reviewPlan) {
      return res.status(404).json({
        success: false,
        error: 'Review plan not found',
      });
    }

    // Make sure review plan belongs to user
    if (reviewPlan.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review plan',
      });
    }

    await reviewPlan.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

