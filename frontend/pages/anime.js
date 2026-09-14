import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchAllMoviesFromTMDB } from './mockMovies';

export default function Anime() {
  const [allAnime, setAllAnime] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('⏳ Загрузка аниме и дорам...');
  const itemsPerPage = 20;

  useEffect(() => {
    async function loadAnime() {
      setLoading(true);
      const loaded = await fetchAllMoviesFromTMDB((progress) => {
        setLoadingStatus(progress.message);
        setAllAnime(progress.movies.filter(m => m.type === 'anime' || m.type === 'kdrama'));
      });
      const filtered = loaded.filter(m => m.type === 'anime' || m.type === 'kdrama');
      setAllAnime(filtered);
      setLoading(false);
    }
    loadAnime();
  }, []);

  // Моментальный поиск с фильтром (только если данные загружены)
  const filteredAnime = useMemo(() => {
    if (allAnime.length === 0) return [];
    
    let result = allAnime;

    if (filter === 'anime') {
      result = result.filter(m => m.type === 'anime');
    } else if (filter === 'kdrama') {
      result = result.filter(m => m.type === 'kdrama');
    }

    if (!search) return result;
    
    const query = search.toLowerCase();
    return result.filter(m =>
      m.title.toLowerCase().includes(query) ||
      (m.description && m.description.toLowerCase().includes(query))
    );
  }, [search, allAnime, filter]);

  const totalPages = Math.ceil(filteredAnime.length / itemsPerPage);
  const paginatedAnime = filteredAnime.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  return (
    <div className="lg:ml-56 bg-black text-white min-h-screen p-6">
      <div className="max-w-6xl">
        <h1 className="text-4xl font-black text-red-600 mb-2">🎨 АНИМЕ И ДОРАМЫ</h1>
        <p className="text-gray-400 mb-8">
          Загружено: 🎨 <span className="text-red-600">{allAnime.filter(m => m.type === 'anime').length}</span> аниме + 🇰🇷 <span className="text-red-600">{allAnime.filter(m => m.type === 'kdrama').length}</span> дорам
        </p>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => {
              setFilter('all');
              setPage(1);
            }}
            className={`px-4 py-2 rounded font-bold transition ${
              filter === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-red-600'
            }`}
          >
            ВСЕ ({allAnime.length})
          </button>
          <button
            onClick={() => {
              setFilter('anime');
              setPage(1);
            }}
            className={`px-4 py-2 rounded font-bold transition ${
              filter === 'anime'
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-red-600'
            }`}
          >
            🎨 АНИМЕ ({allAnime.filter(m => m.type === 'anime').length})
          </button>
          <button
            onClick={() => {
              setFilter('kdrama');
              setPage(1);
            }}
            className={`px-4 py-2 rounded font-bold transition ${
              filter === 'kdrama'
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-red-600'
            }`}
          >
            🇰🇷 ДОРАМЫ ({allAnime.filter(m => m.type === 'kdrama').length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Моментальный поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border-2 border-red-600 text-white px-4 py-3 rounded mb-8 focus:outline-none focus:ring-2 focus:ring-red-600"
          disabled={loading && allAnime.length === 0}
        />

        {/* Loading Status */}
        {loading && allAnime.length < 100 && (
          <div className="bg-gray-900 border-2 border-red-600 p-4 rounded mb-8 text-center">
            <div className="text-red-600 font-bold mb-2">{loadingStatus}</div>
            <div className="text-gray-400 text-sm">Аниме и дорамы отображаются по мере загрузки...</div>
          </div>
        )}

        {paginatedAnime.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {paginatedAnime.map((item) => (
                <Link key={item._id} href={`/movie/${item._id}`} className="group">
                  <div className="bg-gray-900 border-2 border-gray-800 rounded hover:border-red-600 transition h-full flex flex-col">
                    <div className="bg-gray-800 aspect-video overflow-hidden flex-shrink-0">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400?text=No+Poster';
                        }}
                      />
                    </div>
                    <div className="p-3 flex-grow flex flex-col">
                      <h3 className="font-bold text-sm line-clamp-2 group-hover:text-red-600 flex-grow">{item.title}</h3>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <span>⭐ {item.rating ? item.rating.toFixed(1) : 'N/A'}</span>
                        <span className="text-red-600">{item.type === 'anime' ? '🎨' : '🇰🇷'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 items-center">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold rounded transition"
                >
                  ← НАЗАД
                </button>
                <span className="px-4 py-2 text-red-600 font-bold">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold rounded transition"
                >
                  ДАЛЕЕ →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            {loading ? loadingStatus : search ? `"${search}" не найден` : 'Нет аниме и дорам'}
          </div>
        )}
      </div>
    </div>
  );
}
