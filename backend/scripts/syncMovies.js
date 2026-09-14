const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Movie = require('../models/Movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'f9be0e3a88b15cd147b36a649a46abcd';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Жанры для маппинга
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
  37: 'Вестерн',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};

function getContentType(item) {
  if (item.media_type === 'tv' || item.number_of_seasons) return 'tv';
  if (item.genres && item.genres.some(g => g.id === 16)) return 'cartoon';
  if (item.genre_ids && item.genre_ids.includes(16)) return 'cartoon';
  return 'movie';
}

function getGenres(genreIds = []) {
  if (!genreIds || genreIds.length === 0) {
    return ['Неизвестный'];
  }
  
  const genres = genreIds
    .map(id => GENRE_MAP[id])
    .filter(g => g)
    .slice(0, 3);
  
  return genres.length > 0 ? genres : ['Неизвестный'];
}

async function syncMovies() {
  try {
    console.log('🔄 Подключение к MongoDB...');
    
    // Используем правильный URI для локального подключения
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/cinema?authSource=admin';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB подключена');

    let totalSynced = 0;
    const MAX_PAGES = 25;

    const categories = [
      { type: 'movie', endpoint: 'movie/popular', label: '🎬 Популярные фильмы' },
      { type: 'movie', endpoint: 'movie/top_rated', label: '⭐ Лучшие фильмы' },
      { type: 'movie', endpoint: 'movie/upcoming', label: '🎞️ Предстоящие фильмы' },
      { type: 'tv', endpoint: 'tv/popular', label: '📺 Популярные сериалы' },
      { type: 'tv', endpoint: 'tv/top_rated', label: '⭐ Лучшие сериалы' },
      { type: 'tv', endpoint: 'tv/on_the_air', label: '🔴 Идущие сейчас' },
    ];

    for (const category of categories) {
      console.log(`\n${category.label}`);
      let categoryCount = 0;
      
      for (let page = 1; page <= MAX_PAGES; page++) {
        try {
          console.log(`  Загружаю страницу ${page}/${MAX_PAGES}...`);
          
          const response = await axios.get(`${TMDB_BASE_URL}/${category.endpoint}`, {
            params: {
              api_key: TMDB_API_KEY,
              page: page,
              language: 'en-US'
            }
          });

          const results = response.data.results || [];
          
          if (results.length === 0) {
            console.log(`  ✓ Достигнут конец списка на странице ${page}`);
            break;
          }

          for (const tmdbMovie of results) {
            try {
              const tmdbId = category.type === 'tv' ? `tv_${tmdbMovie.id}` : `movie_${tmdbMovie.id}`;
              const existingMovie = await Movie.findOne({ tmdbId });

              if (existingMovie) continue;

              let contentType = category.type;
              if (category.type === 'tv' && tmdbMovie.genre_ids?.includes(16)) {
                contentType = 'cartoon';
              } else if (category.type === 'movie' && tmdbMovie.genre_ids?.includes(16)) {
                contentType = 'cartoon';
              }

              const movie = new Movie({
                tmdbId: tmdbId,
                title: tmdbMovie.title || tmdbMovie.name || 'Без названия',
                description: tmdbMovie.overview || 'Описание не доступно',
                poster: 'https://via.placeholder.com/300x400?text=' + encodeURIComponent((tmdbMovie.title || tmdbMovie.name || 'Film').substring(0, 20)),
                backdrop: 'https://via.placeholder.com/1280x400?text=' + encodeURIComponent('Cinema'),
                releaseDate: tmdbMovie.release_date || tmdbMovie.first_air_date || new Date(),
                rating: tmdbMovie.vote_average || 0,
                genres: getGenres(tmdbMovie.genre_ids),
                type: contentType,
                runtime: tmdbMovie.runtime || 0,
                videoUrl: null,
                averageRating: 0,
                viewCount: 0
              });

              await movie.save();
              totalSynced++;
              categoryCount++;
              
              if (totalSynced % 50 === 0) {
                console.log(`    ✓ Загружено всего: ${totalSynced}`);
              }
            } catch (err) {
              continue;
            }
          }

          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (err) {
          console.error(`  ⚠️ Ошибка на странице ${page}:`, err.message);
          continue;
        }
      }
      
      console.log(`✓ ${category.label}: +${categoryCount} фильмов`);
    }

    console.log(`\n✅ Синхронизация завершена!`);
    console.log(`📊 Всего загружено: ${totalSynced} фильмов/сериалов`);

  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Отключение от MongoDB...');
  }
}

syncMovies();
