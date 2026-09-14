const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('favorites')
      .populate('watchHistory.movie');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to favorites
router.post('/favorites/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user.favorites.includes(req.params.movieId)) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    user.favorites.push(req.params.movieId);
    await user.save();

    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from favorites
router.delete('/favorites/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.movieId);
    await user.save();

    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to watch history
router.post('/watch-history', auth, async (req, res) => {
  try {
    const { movieId, duration } = req.body;
    const user = await User.findById(req.user.userId);

    const historyItem = {
      movie: movieId,
      watchedAt: new Date(),
      duration: duration || 0
    };

    user.watchHistory.unshift(historyItem);
    // Keep only last 50 items
    if (user.watchHistory.length > 50) {
      user.watchHistory.pop();
    }

    await user.save();
    res.json({ message: 'Added to watch history' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get watch history
router.get('/watch-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('watchHistory.movie');
    res.json(user.watchHistory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favorites');
    // Simple recommendation based on favorites
    // In production, implement ML-based recommendation
    const favorites = user.favorites || [];
    res.json({ recommendations: favorites.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
