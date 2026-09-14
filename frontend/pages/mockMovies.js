// Загружаю ВСЕ ВСЕ ВСЕ БЕЗ ОГРАНИЧЕНИЙ из TMDB API
const API_KEY = 'f9be0e3a88b15cd147b36a649a46abcd';
const BASE_URL = 'https://api.themoviedb.org/3';

let cachedMovies = null;

export async function fetchAllMoviesFromTMDB(onProgress = null, clearCache = false) {
  if (clearCache) {
    cachedMovies = null;
    localStorage.removeItem('tmdbCache');
  }
  
  if (cachedMovies && cachedMovies.length > 0) {
    if (onProgress) onProgress({ message: '✅ Использую кешированные данные', count: cachedMovies.length, type: 'done', movies: cachedMovies });
    return cachedMovies;
  }

  const movies = [];
  const uniqueIds = new Set();

  try {
    console.log('🎬🎬🎬 ЗАГРУЖАЮ ВСЕ ВСЕ ВСЕ БЕЗ ОГРАНИЧЕНИЙ!!! 🎬🎬🎬');

    const notify = (msg, type) => {
      if (onProgress) onProgress({ message: msg, count: movies.length, type, movies: [...movies] });
    };

    // Функция для безопасного добавления
    const addMovie = (movie, type, prefix = '') => {
      if (!movie.poster_path) return;
      const id = `${prefix}${movie.id}`;
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        movies.push({
          _id: id,
          title: movie.title || movie.name || movie.original_title || movie.original_name,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          backdrop: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : null,
          rating: movie.vote_average || 0,
          type: type,
          genres: [],
          description: movie.overview || 'Нет описания',
          releaseDate: movie.release_date || movie.first_air_date,
        });
      }
    };

    // Загружаю ВСЕ фильмы (500 страниц макс)
    console.log('📽️ Загружаю ВСЕ ФИЛЬМЫ БЕЗ ОГРАНИЧЕНИЙ...');
    for (let page = 1; page <= 500; page++) {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU&page=${page}`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) break;

        data.results.forEach(m => addMovie(m, 'movie', 'm_'));
        notify(`📽️ Фильмы загружено: ${movies.filter(x => x.type === 'movie').length}`, 'movie');
      } catch (err) {
        console.warn(`⚠️ Ошибка фильмы ${page}:`, err.message);
        break;
      }
    }
    console.log(`✅ ЗАГРУЖЕНО ФИЛЬМОВ: ${movies.filter(m => m.type === 'movie').length}`);

    // Загружаю ВСЕ сериалы (500 страниц макс)
    console.log('📺 Загружаю ВСЕ СЕРИАЛЫ БЕЗ ОГРАНИЧЕНИЙ...');
    for (let page = 1; page <= 500; page++) {
      try {
        const response = await fetch(
          `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ru-RU&page=${page}`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) break;

        data.results.forEach(m => addMovie(m, 'tv', 'tv_'));
        notify(`📺 Сериалы загружено: ${movies.filter(x => x.type === 'tv').length}`, 'tv');
      } catch (err) {
        console.warn(`⚠️ Ошибка сериалы ${page}:`, err.message);
        break;
      }
    }
    console.log(`✅ ЗАГРУЖЕНО СЕРИАЛОВ: ${movies.filter(m => m.type === 'tv').length}`);

    // Загружаю все аниме по многим ключевым словам БЕЗ ОГРАНИЧЕНИЙ
    console.log('🎨 Загружаю ВСЕ АНИМЕ БЕЗ ОГРАНИЧЕНИЙ...');
    const animeQueries = [
      'anime', 'аниме', 
      'jujutsu', 'jujutsu kaisen', 'магическая битва',
      'naruto', 'bleach', 'death note', 'attack titan', 'demon slayer', 
      'one piece', 'dragon ball', 'my hero academia', 'code geass',
      'steins gate', 'parasyte', 'tokyo ghoul', 'vinland saga',
      'mob psycho', 'hunter x hunter', 'fullmetal alchemist',
      'sword art online', 're:zero', 'overlord'
    ];
    
    for (const query of animeQueries) {
      for (let page = 1; page <= 500; page++) {
        try {
          const response = await fetch(
            `${BASE_URL}/search/tv?api_key=${API_KEY}&language=ru-RU&query=${query}&page=${page}`
          );
          const data = await response.json();

          if (!data.results || data.results.length === 0) break;

          // Добавляю ВСЕ результаты - даже если это не типичное аниме
          data.results.forEach(m => {
            addMovie(m, 'anime', `anime_${query}_`);
          });
          
          notify(`🎨 Аниме загружено: ${movies.filter(x => x.type === 'anime').length}`, 'anime');
        } catch (err) {
          break;
        }
      }
    }
    console.log(`✅ ЗАГРУЖЕНО АНИМЕ: ${movies.filter(m => m.type === 'anime').length}`);

    // Загружаю ВСЕ дорамы (корейские сериалы)
    console.log('🇰🇷 Загружаю ВСЕ ДОРАМЫ БЕЗ ОГРАНИЧЕНИЙ...');
    for (let page = 1; page <= 500; page++) {
      try {
        const response = await fetch(
          `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ru-RU&with_origin_country=KR&sort_by=popularity.desc&page=${page}`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) break;

        data.results.forEach(m => addMovie(m, 'kdrama', 'kdrama_'));
        notify(`🇰🇷 Дорамы загружено: ${movies.filter(x => x.type === 'kdrama').length}`, 'kdrama');
      } catch (err) {
        console.warn(`⚠️ Ошибка дорамы ${page}:`, err.message);
        break;
      }
    }
    console.log(`✅ ЗАГРУЖЕНО ДОРАМ: ${movies.filter(m => m.type === 'kdrama').length}`);

    // Дополняю аниме из TV каталога по жанру (16 = animation)
    console.log('🎨 Дополняю АНИМЕ из TV каталога...');
    for (let page = 1; page <= 100; page++) {
      try {
        const response = await fetch(
          `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ru-RU&with_genres=16&sort_by=popularity.desc&page=${page}`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) break;

        data.results.forEach(m => {
          addMovie(m, 'anime', 'animetv_');
        });
        
        notify(`🎨 Аниме загружено: ${movies.filter(x => x.type === 'anime').length}`, 'anime');
      } catch (err) {
        break;
      }
    }

    console.log(`\n🎉🎉🎉 ВСЕ ВСЕ ВСЕ ЗАГРУЖЕНО!!! 🎉🎉🎉`);
    console.log(`🎥 Фильмов: ${movies.filter(m => m.type === 'movie').length}`);
    console.log(`📺 Сериалов: ${movies.filter(m => m.type === 'tv').length}`);
    console.log(`🎨 Аниме: ${movies.filter(m => m.type === 'anime').length}`);
    console.log(`🇰🇷 Дорам: ${movies.filter(m => m.type === 'kdrama').length}`);
    console.log(`📊 ИТОГО: ${movies.length} !!!`);

    notify(`✅ ГОТОВО! Всего: ${movies.length}`, 'done');
    cachedMovies = movies;
    
    // Сохраняю в localStorage для быстрой загрузки
    try {
      localStorage.setItem('tmdbCacheCount', movies.length.toString());
    } catch (e) {
      console.warn('Не могу сохранить в localStorage');
    }
    
    return movies;
  } catch (error) {
    console.error('❌ Ошибка загрузки TMDB:', error);
    return [];
  }
}

export const ALL_MOVIES = [];
