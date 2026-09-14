const express = require('express');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Comment = require('../models/Comment');

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments();

    res.json({
      users,
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

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie
router.post('/movies', async (req, res) => {
  try {
    const { title, description, poster, backdrop, releaseDate, genres, type, videoUrl } = req.body;

    const movie = new Movie({
      title,
      description,
      poster,
      backdrop,
      releaseDate,
      genres,
      type,
      videoUrl,
      tmdbId: Math.random() * 1000000 // Placeholder
    });

    await movie.save();
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update movie
router.put('/movies/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.movieId, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete movie
router.delete('/movies/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all comments
router.get('/comments', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find()
      .populate('user', 'username')
      .populate('movie', 'title')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments();

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

// Delete comment (moderation)
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalComments = await Comment.countDocuments();

    const topMovies = await Movie.find()
      .sort({ viewCount: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalMovies,
      totalComments,
      topMovies
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
