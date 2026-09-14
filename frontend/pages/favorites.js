import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/user/profile');
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">❤️ Избранное</h1>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg text-center text-gray-400">
            <p className="text-xl">Ваше избранное пусто</p>
            <a href="/catalog" className="text-primary hover:text-indigo-400 mt-4 inline-block">
              Перейти в каталог →
            </a>
          </div>
        )}
      </div>
    </>
  );
}
