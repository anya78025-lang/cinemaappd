const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for movie
router.get('/:movieId', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ movie: req.params.movieId })
      .populate('user', 'username avatar')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ movie: req.params.movieId });

    res.json({
      comments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/:movieId', auth, [
  body('text').trim().isLength({ min: 1, max: 1000 }),
  body('rating').isInt({ min: 1, max: 10 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const comment = new Comment({
      movie: req.params.movieId,
      user: req.user.userId,
      text: req.body.text,
      rating: req.body.rating
    });

    await comment.save();
    await comment.populate('user', 'username avatar');

    // Update average rating
    const allComments = await Comment.find({ movie: req.params.movieId });
    const avgRating = allComments.reduce((sum, c) => sum + c.rating, 0) / allComments.length;
    movie.averageRating = avgRating;
    movie.comments.push(comment.id);
    await movie.save();

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment
router.put('/:commentId', auth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.body.text) comment.text = req.body.text;
    if (req.body.rating) comment.rating = req.body.rating;
    comment.updatedAt = new Date();

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Comment.deleteOne({ _id: req.params.commentId });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like comment
router.post('/:commentId/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.likes += 1;
    await comment.save();

    res.json({ likes: comment.likes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
