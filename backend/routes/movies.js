const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const GENRE_MAP = {
  28: 'Действие',
  12: 'Приключения',
  16: 'Анимация',
  35: 'Комедия',
  80: 'Криминал',
  99: 'Документальный',
  18: 'Драма',
  10751: 'Семейный',
  14: 'Фантастика',
  36: 'История',
  27: 'Ужас',
  10402: 'Музыка',
  9648: 'Мистика',
  10749: 'Романтика',
  878: 'Научная фантастика',
  10770: 'Телевизионный фильм',
  53: 'Триллер',
  10752: 'Война',
  37: 'Вестерн'
};

// Get movies with filters
router.get('/', async (req, res) => {
  try {
    const { genre, search, page = 1, type = '' } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (genre) {
      query.genres = genre;
    }
    if (type && type !== '') {
      query.type = type;
    }

    const limit = 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('comments');
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    movie.viewCount += 1;
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ genres: req.params.genre })
      .limit(limit)
      .skip(skip);

    const total = await Movie.countDocuments({ genres: req.params.genre });

    res.json({
      movies,
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

// Sync from TMDb
router.post('/sync-tmdb', auth, async (req, res) => {
  try {
    console.log('Starting TMDb sync...');
    
    const categories = [
      { type: 'movie', endpoint: 'movie/popular' },
      { type: 'movie', endpoint: 'movie/top_rated' },
      { type: 'tv', endpoint: 'tv/popular' },
      { type: 'tv', endpoint: 'tv/top_rated' }
    ];

    let totalSynced = 0;

    for (const category of categories) {
      for (let page = 1; page <= 10; page++) {
        const response = await axios.get(`${TMDB_BASE_URL}/${category.endpoint}`, {
          params: {
            api_key: TMDB_API_KEY,
            page: page,
            language: 'ru-RU'
          }
        });

        for (const tmdbMovie of response.data.results) {
          const tmdbId = category.type === 'tv' ? `tv_${tmdbMovie.id}` : tmdbMovie.id;
          const existingMovie = await Movie.findOne({ tmdbId });
          
          if (!existingMovie) {
            let contentType = category.type;
            if (category.type === 'movie' && tmdbMovie.genre_ids?.includes(16)) {
              contentType = 'cartoon';
            } else if (category.type === 'tv' && tmdbMovie.genre_ids?.includes(16)) {
              contentType = 'cartoon_tv';
            }

            const movie = new Movie({
              tmdbId: tmdbId,
              title: tmdbMovie.title || tmdbMovie.name,
              description: tmdbMovie.overview,
              poster: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`,
              backdrop: `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}`,
              releaseDate: tmdbMovie.release_date || tmdbMovie.first_air_date,
              rating: tmdbMovie.vote_average,
              genres: tmdbMovie.genre_ids?.map(id => GENRE_MAP[id]).filter(g => g) || ['Неизвестный'],
              type: contentType
            });

            await movie.save();
            totalSynced++;
          }
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    res.json({ message: `Synced ${totalSynced} movies successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
