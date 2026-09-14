import Link from 'next/link';
import Image from 'next/image';

export default function MovieCard({ movie }) {
  return (
    <Link href={`/movie/${movie._id}`}>
      <div className="bg-secondary rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-300 shadow-lg">
        <div className="relative w-full h-64">
          <Image
            src={movie.poster || 'https://via.placeholder.com/300x400'}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-primary px-2 py-1 rounded text-white text-sm font-bold">
            {movie.averageRating.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-bold truncate">{movie.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{movie.type}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres?.slice(0, 2).map((genre) => (
              <span key={genre} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2">{movie.viewCount} просмотров</p>
        </div>
      </div>
    </Link>
  );
}
