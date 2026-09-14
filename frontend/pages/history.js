import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

export default function History() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/user/watch-history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
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
        <h1 className="text-4xl font-bold text-white mb-8">📺 История просмотров</h1>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, index) => (
              <Link key={index} href={`/movie/${item.movie?._id}`}>
                <div className="bg-gray-900 border border-gray-800 p-4 rounded hover:bg-gray-800 transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold text-lg">{item.movie?.title}</h3>
                      <p className="text-gray-400">
                        {new Date(item.watchedAt).toLocaleDateString()}
                        {' '}
                        {new Date(item.watchedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="text-primary text-lg">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg text-center text-gray-400">
            <p className="text-xl">История просмотров пуста</p>
            <a href="/catalog" className="text-primary hover:text-indigo-400 mt-4 inline-block">
              Перейти в каталог →
            </a>
          </div>
        )}
      </div>
    </>
  );
}
