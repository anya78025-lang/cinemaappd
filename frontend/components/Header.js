import Link from 'next/link';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white hidden lg:block">
            Рекомендации
          </h1>
        </div>

        {/* Right - User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-white hover:text-primary transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.username?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm">{user.username}</span>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 border border-gray-800">
                  <Link href="/profile">
                    <a className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition">
                      Мой профиль
                    </a>
                  </Link>
                  <Link href="/favorites">
                    <a className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition">
                      Избранное
                    </a>
                  </Link>
                  <Link href="/history">
                    <a className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition">
                      История
                    </a>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <a className="block px-4 py-2 text-primary hover:bg-gray-800 transition">
                        Админ-панель
                      </a>
                    </Link>
                  )}
                  <hr className="border-gray-700 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 transition"
                  >
                    Выход
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <a className="px-3 py-1 text-sm text-gray-300 hover:text-white">
                  Вход
                </a>
              </Link>
              <Link href="/register">
                <a className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-indigo-700 transition">
                  Регистрация
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
