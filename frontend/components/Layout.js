import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
