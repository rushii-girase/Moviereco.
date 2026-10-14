import React from 'react';
import { MovieCard } from '../MovieCard/MovieCard';
import type { Movie } from '../MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  wishlistIds?: number[];
  onToggleWishlist?: (movieId: number, e: React.MouseEvent) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard} />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No films found matching this selection.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isInWishlist={wishlistIds.includes(movie.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
};
