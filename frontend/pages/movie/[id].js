import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchAllMoviesFromTMDB } from '../mockMovies';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerUrl, setPlayerUrl] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const loaded = await fetchAllMoviesFromTMDB();
      setAllMovies(loaded);
      const found = loaded.find(m => m._id === id);
      setMovie(found || null);
      setLoading(false);
    }
    if (id) {
      loadData();
    }
  }, [id]);

  /**
   * Шаг 2: Загружаем ANIBOOM плеер через backend
   * Backend обращается к Shikimori API и возвращает прямую ссылку на ANIBOOM
   */
  const loadAniboomPlayer = async () => {
    if (!movie) return;
    
    setPlayerLoading(true);
    const clientStartTime = Date.now();
    
    try {
      // Извлекаю число из ID (например "a_603" -> "603")
      const animeId = movie._id.replace(/[^0-9]/g, '');
      
      if (!animeId) {
        console.log('❌ Не смог извлечь числовой ID');
        setPlayerLoading(false);
        return;
      }

      console.log(`🎬 [ANIBOOM] Загружаю плеер для аниме ID: ${animeId}`);
      
      // Ищу через backend (обходит CORS)
      // Backend автоматически ищет в Shikimori → Kodik → возвращает ANIBOOM ссылку
      const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/player/aniboom/${animeId}`;
      
      const response = await fetch(backendUrl);
      const clientFetchTime = Date.now() - clientStartTime;
      const data = await response.json();

      if (data.success && data.link) {
        const totalTime = Date.now() - clientStartTime;
        console.log(`✅ [ANIBOOM] Видео найдено за ${totalTime}ms (fetch: ${clientFetchTime}ms, backend: ${data.loadTime}ms, source: ${data.source}):`, data.link);
        setPlayerUrl(data.link);
      } else {
        const totalTime = Date.now() - clientStartTime;
        console.log(`❌ [ANIBOOM] Видео не найдено за ${totalTime}ms для ID: ${animeId}`);
        console.log('💡 Сообщение:', data.message);
        setPlayerUrl(null);
        
        // Показываем пользователю подсказку
        alert(`❌ Видео не найдено\n\n💡 Попробуй поискать это аниме вручную на:\nhttps://aniboom.one`);
      }
    } catch (error) {
      const totalTime = Date.now() - clientStartTime;
      console.error(`❌ Ошибка загрузки плеера за ${totalTime}ms:`, error);
      setPlayerUrl(null);
      alert(`Ошибка при загрузке плеера (${totalTime}ms):\n${error.message}`);
    } finally {
      setPlayerLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lg:ml-56 bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-3xl">⏳ Загрузка...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="lg:ml-56 bg-black text-white min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-3xl">❌ Фильм не найден</div>
        <Link href="/movies" className="text-red-600 hover:text-red-700 font-bold">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const similar = allMovies
    .filter(m => m.type === movie.type && m._id !== movie._id)
    .slice(0, 10);

  return (
    <div className="lg:ml-56 bg-black text-white min-h-screen">
      {/* Backdrop */}
      <div className="bg-gradient-to-b from-red-900 to-black h-64 overflow-hidden relative p-8">
        {movie.backdrop && (
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <Link href={movie.type === 'movie' ? '/movies' : movie.type === 'tv' ? '/tv' : '/anime'} className="text-gray-300 hover:text-red-600 mb-4">
            ← Назад
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex gap-8 mb-12">
          {/* Poster */}
          {movie.poster && (
            <div className="flex-shrink-0 -mt-40">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-lg border-4 border-red-600 shadow-2xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Poster';
                }}
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 pt-8">
            <h1 className="text-5xl font-black text-red-600 mb-4">{movie.title}</h1>

            <div className="flex gap-6 mb-6 text-lg flex-wrap">
              <div>
                <span className="text-gray-400">Рейтинг:</span>{' '}
                <span className="text-red-600 font-bold text-2xl">⭐ {(movie.rating || 0).toFixed(1)}</span>
              </div>
              <div>
                <span className="text-gray-400">Тип:</span>{' '}
                <span className="text-red-600 font-bold capitalize">
                  {movie.type === 'movie' ? '🎥 Фильм' : movie.type === 'tv' ? '📺 Сериал' : movie.type === 'anime' ? '🎨 Аниме' : '🇰🇷 Дорама'}
                </span>
              </div>
            </div>

            {movie.releaseDate && (
              <div className="mb-6">
                <span className="text-gray-400">Дата выхода: </span>
                <span className="text-white">{new Date(movie.releaseDate).toLocaleDateString('ru-RU')}</span>
              </div>
            )}

            <div className="mb-8 text-gray-300 leading-relaxed max-w-2xl">
              <p>{movie.description}</p>
            </div>

            <button 
              onClick={loadAniboomPlayer}
              disabled={playerLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-black py-4 px-12 rounded-lg text-xl transition shadow-lg hover:shadow-red-600/50"
            >
              {playerLoading ? '⏳ Загрузка плеера...' : '▶️ СМОТРЕТЬ ОНЛАЙН'}
            </button>
          </div>
        </div>

        {/* Video Player */}
        {playerUrl && (
          <div className="mb-12 border-t-2 border-red-600 pt-12">
            <h2 className="text-3xl font-black text-red-600 mb-8">🎬 СМОТРЕТЬ НА ANIBOOM</h2>
            {/* Шаг 3: Адаптивный iframe с правильными атрибутами для CORS */}
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={playerUrl}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
                style={{ 
                  border: 'none',
                  minHeight: '400px'
                }}
                title={`Видео плеер - ${movie.title}`}
              />
            </div>
            <p className="text-gray-400 text-sm mt-4">💡 Если видео не загружается, может быть оно еще не добавлено в базу данных.</p>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="py-12 border-t-2 border-red-600">
            <h2 className="text-3xl font-black text-red-600 mb-8">
              {movie.type === 'movie' ? '🎥 ПОХОЖИЕ ФИЛЬМЫ' : movie.type === 'tv' ? '📺 ПОХОЖИЕ СЕРИАЛЫ' : movie.type === 'anime' ? '🎨 ПОХОЖЕЕ АНИМЕ' : '🇰🇷 ПОХОЖИЕ ДОРАМЫ'}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {similar.map((item) => (
                <Link key={item._id} href={`/movie/${item._id}`} className="group">
                  <div className="bg-gray-900 border-2 border-gray-800 rounded hover:border-red-600 transition cursor-pointer">
                    <div className="bg-gray-800 aspect-video overflow-hidden">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400?text=No+Poster';
                        }}
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-bold text-xs line-clamp-2 group-hover:text-red-600">{item.title}</h3>
                      <div className="text-xs text-gray-400 mt-1">⭐ {(item.rating || 0).toFixed(1)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
