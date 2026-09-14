import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import MovieCard from '../components/MovieCard';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white text-xl">Ошибка загрузки профиля</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="px-6 py-8">
        {/* Profile Header */}
        <div className="bg-gray-900 p-8 rounded-lg mb-8 flex flex-col sm:flex-row items-center gap-8 border border-gray-800">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
            {profile.username?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">{profile.username}</h1>
            <p className="text-gray-400 mb-4">{profile.email}</p>
            <p className="text-primary font-bold">
              {profile.role === 'admin' ? '👑 Администратор' : '👤 Пользователь'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${
              activeTab === 'info'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Информация
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${
              activeTab === 'favorites'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Избранное ({profile.favorites?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${
              activeTab === 'history'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            История ({profile.watchHistory?.length || 0})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'info' && (
          <div className="bg-gray-900 p-8 rounded-lg text-white border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Личная информация</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Имя пользователя</p>
                <p className="text-xl font-bold">{profile.username}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-xl font-bold">{profile.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Дата регистрации</p>
                <p className="text-xl font-bold">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Роль</p>
                <p className="text-xl font-bold">
                  {profile.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {profile.favorites && profile.favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {profile.favorites.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 p-8 rounded-lg text-center text-gray-400 border border-gray-800">
                <p>Избранное пусто</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {profile.watchHistory && profile.watchHistory.length > 0 ? (
              <div className="space-y-3">
                {profile.watchHistory.map((item, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded flex justify-between items-center border border-gray-800 hover:border-gray-700 transition">
                    <div>
                      <h3 className="text-white font-bold">{item.movie?.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(item.watchedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a href={`/movie/${item.movie?._id}`} className="text-primary hover:text-indigo-400 transition">
                      Смотреть →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 p-8 rounded-lg text-center text-gray-400 border border-gray-800">
                <p>История просмотров пуста</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
