const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Movie = require('../models/Movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'f9be0e3a88b15cd147b36a649a46abcd';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const GENRE_MAP = {
  28: 'Действие', 12: 'Приключения', 16: 'Анимация', 35: 'Комедия', 80: 'Криминал',
  99: 'Документальный', 18: 'Драма', 10751: 'Семейный', 14: 'Фантастика', 36: 'История',
  27: 'Ужас', 10402: 'Музыка', 9648: 'Мистика', 10749: 'Романтика', 878: 'Научная фантастика',
  10770: 'Телевизионный фильм', 53: 'Триллер', 10752: 'Война', 37: 'Вестерн'
};

async function loadRealMovies() {
  try {
    console.log('🔄 Подключение к MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/cinema?authSource=admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB подключена\n');

    console.log('📥 Загружаю фильмы из TMDb...\n');
    let totalLoaded = 0;

    // Загружаем Фильмы
    console.log('🎬 Загружаю ФИЛЬМЫ...');
    for (let page = 1; page <= 5; page++) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            page,
            language: 'en-US'
          }
        });

        for (const item of response.data.results) {
          if (!item.poster_path) continue;

          const existing = await Movie.findOne({ tmdbId: `movie_${item.id}` });
          if (existing) continue;

          const movie = new Movie({
            tmdbId: `movie_${item.id}`,
            title: item.title,
            description: item.overview,
            poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
            releaseDate: item.release_date,
            rating: item.vote_average,
            genres: item.genre_ids?.map(id => GENRE_MAP[id]).filter(g => g) || ['Фильм'],
            type: 'movie',
            viewCount: 0,
            averageRating: 0
          });

          await movie.save();
          totalLoaded++;
          console.log(`  ✓ ${movie.title}`);
        }

        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.error(`  ✗ Ошибка на странице ${page}:`, err.message);
      }
    }

    // Загружаем Сериалы
    console.log('\n📺 Загружаю СЕРИАЛЫ...');
    for (let page = 1; page <= 3; page++) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            page,
            language: 'en-US'
          }
        });

        for (const item of response.data.results) {
          if (!item.poster_path) continue;

          const existing = await Movie.findOne({ tmdbId: `tv_${item.id}` });
          if (existing) continue;

          const movie = new Movie({
            tmdbId: `tv_${item.id}`,
            title: item.name,
            description: item.overview,
            poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
            releaseDate: item.first_air_date,
            rating: item.vote_average,
            genres: item.genre_ids?.map(id => GENRE_MAP[id]).filter(g => g) || ['Сериал'],
            type: 'tv',
            viewCount: 0,
            averageRating: 0
          });

          await movie.save();
          totalLoaded++;
          console.log(`  ✓ ${movie.title}`);
        }

        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.error(`  ✗ Ошибка на странице ${page}:`, err.message);
      }
    }

    console.log(`\n✅ Загружено всего: ${totalLoaded} фильмов/сериалов`);
    console.log('🔌 Отключаюсь от MongoDB...');
    await mongoose.disconnect();

  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
  }
}

loadRealMovies();
