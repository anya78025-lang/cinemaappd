import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

export default function AdminPanel() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genres: [],
    type: 'movie'
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    } else {
      loadAdminData();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'stats') loadStats();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'movies') loadMovies();
    if (activeTab === 'comments') loadComments();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadMovies = async () => {
    try {
      const response = await api.get('/movies');
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await api.get('/admin/comments');
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadAdminData = async () => {
    await Promise.all([loadStats(), loadUsers(), loadMovies(), loadComments()]);
    setLoading(false);
  };

  const deleteUser = async (userId) => {
    if (confirm('Вы уверены?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const deleteMovie = async (movieId) => {
    if (confirm('Вы уверены?')) {
      try {
        await api.delete(`/admin/movies/${movieId}`);
        loadMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (confirm('Вы уверены?')) {
      try {
        await api.delete(`/admin/comments/${commentId}`);
        loadComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/movies', newMovie);
      setNewMovie({ title: '', description: '', genres: [], type: 'movie' });
      loadMovies();
      setActiveTab('movies');
    } catch (error) {
      console.error('Error adding movie:', error);
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
        <h1 className="text-4xl font-bold text-white mb-8">👑 Администраторская панель</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 flex-wrap">
          {['stats', 'users', 'movies', 'comments', 'add-movie'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-bold ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'stats' && '📊 Статистика'}
              {tab === 'users' && '👥 Пользователи'}
              {tab === 'movies' && '🎬 Фильмы'}
              {tab === 'comments' && '💬 Комментарии'}
              {tab === 'add-movie' && '➕ Добавить'}
            </button>
          ))}
        </div>

        {/* Stats */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <p className="text-gray-400">Всего пользователей</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.totalUsers}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <p className="text-gray-400">Всего фильмов</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.totalMovies}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <p className="text-gray-400">Всего комментариев</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.totalComments}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <p className="text-gray-400">Топ фильм</p>
              <p className="text-lg font-bold text-primary mt-2">
                {stats.topMovies[0]?.title || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-gray-900 border border-gray-800 p-4 rounded flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">{user.username}</p>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Movies */}
        {activeTab === 'movies' && (
          <div className="space-y-4">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-gray-900 border border-gray-800 p-4 rounded flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">{movie.title}</p>
                  <p className="text-gray-400">{movie.genres?.join(', ')}</p>
                </div>
                <button
                  onClick={() => deleteMovie(movie._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Comments */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-900 border border-gray-800 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-white font-bold">{comment.user?.username}</p>
                    <p className="text-gray-400 text-sm">{comment.movie?.title}</p>
                  </div>
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Удалить
                  </button>
                </div>
                <p className="text-gray-300">{comment.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Movie Form */}
        {activeTab === 'add-movie' && (
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Добавить фильм</h2>
            <form onSubmit={handleAddMovie}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Название</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white rounded px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Описание</label>
                <textarea
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded px-4 py-2 h-24"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Тип</label>
                <select
                  value={newMovie.type}
                  onChange={(e) => setNewMovie({ ...newMovie, type: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded px-4 py-2"
                >
                  <option value="movie">Фильм</option>
                  <option value="tv">Сериал</option>
                  <option value="anime">Аниме</option>
                  <option value="cartoon">Мультфильм</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-2 rounded hover:bg-indigo-700"
              >
                Добавить
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
