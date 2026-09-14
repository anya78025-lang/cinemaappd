import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchAllMoviesFromTMDB } from './mockMovies';

export default function Movies() {
  const [allMovies, setAllMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('⏳ Загрузка фильмов...');
  const itemsPerPage = 20;

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      const loaded = await fetchAllMoviesFromTMDB((progress) => {
        setLoadingStatus(progress.message);
        setAllMovies(progress.movies.filter(m => m.type === 'movie'));
      });
      const filtered = loaded.filter(m => m.type === 'movie');
      setAllMovies(filtered);
      setLoading(false);
    }
    loadMovies();
  }, []);

  // Моментальный поиск (только если данные загружены)
  const filteredMovies = useMemo(() => {
    if (allMovies.length === 0) return [];
    if (!search) return allMovies;
    const query = search.toLowerCase();
    return allMovies.filter(m =>
      m.title.toLowerCase().includes(query) ||
      (m.description && m.description.toLowerCase().includes(query))
    );
  }, [search, allMovies]);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = filteredMovies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="lg:ml-56 bg-black text-white min-h-screen p-6">
      <div className="max-w-6xl">
        <h1 className="text-4xl font-black text-red-600 mb-2">🎥 ФИЛЬМЫ</h1>
        <p className="text-gray-400 mb-8">
          Загружено фильмов: <span className="text-red-600 font-bold">{allMovies.length}</span>
          {search && ` • Найдено: ${filteredMovies.length}`}
        </p>

        <input
          type="text"
          placeholder="Моментальный поиск фильмов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border-2 border-red-600 text-white px-4 py-3 rounded mb-8 focus:outline-none focus:ring-2 focus:ring-red-600"
          disabled={loading && allMovies.length === 0}
        />

        {/* Loading Status */}
        {loading && allMovies.length < 100 && (
          <div className="bg-gray-900 border-2 border-red-600 p-4 rounded mb-8 text-center">
            <div className="text-red-600 font-bold mb-2">{loadingStatus}</div>
            <div className="text-gray-400 text-sm">Фильмы отображаются по мере загрузки...</div>
          </div>
        )}

        {paginatedMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {paginatedMovies.map((movie) => (
                <Link key={movie._id} href={`/movie/${movie._id}`} className="group">
                  <div className="bg-gray-900 border-2 border-gray-800 rounded hover:border-red-600 transition h-full flex flex-col">
                    <div className="bg-gray-800 aspect-video overflow-hidden flex-shrink-0">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400?text=No+Poster';
                        }}
                      />
                    </div>
                    <div className="p-3 flex-grow flex flex-col">
                      <h3 className="font-bold text-sm line-clamp-2 group-hover:text-red-600 flex-grow">{movie.title}</h3>
                      <div className="text-xs text-gray-400 mt-2">⭐ {movie.rating ? movie.rating.toFixed(1) : 'N/A'}</div>
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
            {loading ? loadingStatus : search ? `"${search}" не найден` : 'Нет фильмов'}
          </div>
        )}
      </div>
    </div>
  );
}
