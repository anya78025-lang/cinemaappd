import '../styles/globals.css';
import Sidebar from '../components/Sidebar';

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
