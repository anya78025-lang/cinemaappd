import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAllMoviesFromTMDB } from './mockMovies';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      const allMovies = await fetchAllMoviesFromTMDB();
      setMovies(allMovies.slice(0, 12));
      setTotal(allMovies.length);
      setLoading(false);
    }
    loadMovies();
  }, []);

  return (
    <div className="lg:ml-56 bg-black text-white min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-900 via-black to-black p-8 lg:p-16">
        <h1 className="text-4xl lg:text-6xl font-black text-red-600 mb-4">
          ДОБРО ПОЖАЛОВАТЬ
        </h1>
        <p className="text-lg text-gray-300 mb-6 max-w-2xl">
          Смотри {total} фильмов и сериалов из TMDB в одном месте. Реальные постеры и описания.
        </p>
        <Link href="/movies" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition">
          ПЕРЕЙТИ В КАТАЛОГ →
        </Link>
      </div>

      {/* Movies Grid */}
      <div className="p-8 lg:p-16">
        <h2 className="text-3xl font-black text-red-600 mb-8">🎬 ПОПУЛЯРНЫЕ</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-3xl">⏳ Загрузка фильмов из TMDB...</div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <Link key={movie._id} href={`/movie/${movie._id}`} className="group cursor-pointer">
                <div className="bg-gray-900 border-2 border-gray-800 rounded overflow-hidden hover:border-red-600 transition h-full">
                  <div className="bg-gray-800 aspect-video relative overflow-hidden">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Poster';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm line-clamp-2 group-hover:text-red-600 transition">
                      {movie.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                      <span>⭐ {(movie.rating || 0).toFixed(1)}</span>
                      <span className="text-red-600 font-bold">{movie.type === 'movie' ? '🎥' : '📺'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
