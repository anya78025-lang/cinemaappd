import { useState, useEffect } from 'react';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';

const GENRES = [
  'Действие', 'Комедия', 'Драма', 'Ужас', 'Триллер',
  'Фантастика', 'Приключения', 'Анимация', 'Документальный'
];

const TYPES = [
  { value: '', label: 'Все' },
  { value: 'movie', label: 'Фильмы' },
  { value: 'tv', label: 'Сериалы' },
  { value: 'anime', label: 'Аниме' },
  { value: 'cartoon', label: 'Мультфильмы' }
];

export default function Catalog() {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    type: '',
    page: 1
  });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        ...(filters.search && { search: filters.search }),
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.type && { type: filters.type })
      };

      const response = await api.get('/movies', { params });
      setMovies(response.data.movies);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Каталог фильмов</h1>

        {/* Filters */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Поиск</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Название фильма..."
                className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-700 focus:border-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Тип</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-700 focus:border-primary outline-none transition"
              >
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Жанр</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full bg-gray-800 text-white rounded px-4 py-2 border border-gray-700 focus:border-primary outline-none transition"
              >
                <option value="">Все жанры</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">&nbsp;</label>
              <button
                onClick={() => setFilters({ search: '', genre: '', type: '', page: 1 })}
                className="w-full bg-primary text-white rounded px-4 py-2 hover:bg-indigo-700 transition"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin text-3xl">⏳</div>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition border border-gray-700"
                >
                  ← Назад
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handleFilterChange('page', page)}
                    className={`px-4 py-2 rounded transition border ${
                      filters.page === page
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={filters.page === pagination.pages}
                  className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition border border-gray-700"
                >
                  Далее →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">Фильмы не найдены</p>
          </div>
        )}
      </div>
    </>
  );
}
