// Скрипт для загрузки фильмов из TMDB API
const API_KEY = 'f9be0e3a88b15cd147b36a649a46abcd';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function loadAllMovies() {
  const movies = [];
  
  try {
    console.log('🎬 Загружаю фильмы из TMDB...');
    
    // Загружаю популярные фильмы (20 страниц = 400 фильмов)
    for (let page = 1; page <= 20; page++) {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU&page=${page}`
      );
      const data = await response.json();
      
      if (data.results) {
        data.results.forEach(movie => {
          movies.push({
            _id: String(movie.id),
            title: movie.title || movie.original_title,
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x400?text=No+Poster',
            backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
            rating: movie.vote_average || 0,
            type: 'movie',
            genres: [],
            description: movie.overview || 'Нет описания',
            releaseDate: movie.release_date,
          });
        });
      }
      
      console.log(`✅ Загружена страница ${page}/20 (${movies.length} фильмов)`);
    }
    
    // Загружаю популярные сериалы (10 страниц = 200 сериалов)
    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ru-RU&page=${page}`
      );
      const data = await response.json();
      
      if (data.results) {
        data.results.forEach(show => {
          movies.push({
            _id: `tv_${show.id}`,
            title: show.name || show.original_name,
            poster: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 'https://via.placeholder.com/300x400?text=No+Poster',
            backdrop: show.backdrop_path ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}` : null,
            rating: show.vote_average || 0,
            type: 'tv',
            genres: [],
            description: show.overview || 'Нет описания',
          });
        });
      }
      
      console.log(`✅ Загружена страница сериалов ${page}/10 (${movies.filter(m => m.type === 'tv').length} сериалов)`);
    }
    
    console.log(`🎉 Загружено ${movies.length} фильмов и сериалов!`);
    return movies;
    
  } catch (error) {
    console.error('❌ Ошибка загрузки:', error);
    return [];
  }
}

// Экспортирую как модуль
if (typeof window !== 'undefined') {
  window.loadAllMovies = loadAllMovies;
}
