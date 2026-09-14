import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: '🔍', label: 'Поиск', href: '/search' },
    { icon: '🏠', label: 'Главное', href: '/' },
    { icon: '🎬', label: 'Фильмы', href: '/movies' },
    { icon: '📺', label: 'Сериалы', href: '/tv' },
    { icon: '🎨', label: 'Аниме', href: '/anime' },
    { icon: '❤️', label: 'Избранное', href: '/favorites' },
    { icon: '👤', label: 'Профиль', href: '/profile' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-red-600 p-2 rounded text-white"
      >
        ☰ МЕНЮ
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-56 bg-black border-r-2 border-red-600 transform transition-transform lg:translate-x-0 z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b-2 border-red-600">
          <Link href="/" className="text-2xl font-black text-red-600 cursor-pointer">
            🎬 КИНО
          </Link>
        </div>

        {/* Menu */}
        <nav className="py-4">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-bold transition-colors block ${
                router.pathname === item.href
                  ? 'text-red-600 bg-gray-900 border-l-4 border-red-600'
                  : 'text-gray-300 hover:text-white hover:bg-gray-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg mr-4">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
