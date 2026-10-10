import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark } from 'lucide-react';
import styles from './MovieCard.module.css';

export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseYear?: number;
  rating?: number;
}

interface MovieCardProps {
  movie: Movie;
  isInWishlist?: boolean;
  onToggleWishlist?: (movieId: number, e: React.MouseEvent) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  const imageUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w342${movie.posterPath}`
    : null;

  return (
    <div style={{ position: 'relative' }}>
      {onToggleWishlist && (
        <button
          className={`${styles.wishlistBtn} ${isInWishlist ? styles.active : ''}`}
          onClick={(e) => onToggleWishlist(movie.id, e)}
          aria-label={isInWishlist ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
          aria-pressed={isInWishlist}
        >
          <Bookmark size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>
      )}

      <Link to={`/movie/${movie.id}`} className={styles.card}>
        <div className={styles.posterWrapper}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Poster of ${movie.title}`}
              className={styles.poster}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder}>No Poster Available</div>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{movie.title}</h3>
          <div className={styles.meta}>
            <span>{movie.releaseYear || 'N/A'}</span>
            {movie.rating && (
              <div className={styles.rating}>
                <Star size={14} fill="currentColor" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
