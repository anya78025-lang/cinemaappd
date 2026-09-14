const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  poster: String,
  backdrop: String,
  releaseDate: Date,
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  genres: [String],
  type: {
    type: String,
    enum: ['movie', 'tv', 'anime', 'cartoon'],
    default: 'movie'
  },
  runtime: Number,
  videoUrl: String,
  averageRating: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', MovieSchema);
