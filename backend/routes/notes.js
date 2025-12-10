const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// @route   GET /api/notes
// @desc    Get all notes for authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ user_id: req.user._id })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    // Make sure note belongs to user
    if (note.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this note',
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   POST /api/notes
// @desc    Create new note
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a title',
      });
    }

    const note = await Note.create({
      user_id: req.user._id,
      title,
      content: content || '',
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    // Make sure note belongs to user
    if (note.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this note',
      });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    // Make sure note belongs to user
    if (note.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this note',
      });
    }

    await note.deleteOne();

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

