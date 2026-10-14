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
    <div className={styles.wrapper}>
      {onToggleWishlist && (
        <button
          type="button"
          className={`${styles.wishlistBtn} ${isInWishlist ? styles.active : ''}`}
          onClick={(e) => onToggleWishlist(movie.id, e)}
          aria-label={isInWishlist ? `Remove ${movie.title} from wishlist` : `Add ${movie.title} to wishlist`}
          aria-pressed={isInWishlist}
        >
          <Bookmark size={15} fill={isInWishlist ? 'currentColor' : 'none'} />
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
            <div className={styles.placeholder}>No Poster</div>
          )}

          {movie.rating && movie.rating > 0 ? (
            <div className={styles.ratingBadge}>
              <Star size={11} fill="currentColor" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{movie.title}</h3>

          <div className={styles.meta}>
            <span>{movie.releaseYear || 'Cinema'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
