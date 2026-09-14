import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

export default function Register() {
  const router = useRouter();
  const { saveToStorage } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      saveToStorage(response.data.user, response.data.token);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-black px-6 py-8">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-6">Регистрация</h1>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Имя пользователя</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Введите имя пользователя"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Введите пароль"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Подтвердите пароль</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Повторите пароль"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-4">
            Уже есть аккаунт?{' '}
            <a href="/login" className="text-primary hover:text-indigo-400">
              Войти
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
