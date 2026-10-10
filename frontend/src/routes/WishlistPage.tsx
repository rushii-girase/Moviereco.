import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';

export const WishlistPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadWishlistMovies = async () => {
      if (wishlistIds.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        const moviePromises = wishlistIds.map((id) =>
          fetchMovieDetails(id.toString()).then((d) => ({
            id: d.id,
            title: d.title,
            posterPath: d.poster_path,
            releaseYear: d.release_date ? parseInt(d.release_date.split('-')[0]) : undefined,
            rating: d.vote_average,
          }))
        );
        const results = await Promise.all(moviePromises);
        setMovies(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistMovies();
  }, [wishlistIds]);

  const handleToggleWishlist = (movieId: number, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlistIds((prev) => {
      const updated = prev.filter((id) => id !== movieId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-10)' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)' }}>
        My Wishlist ({wishlistIds.length})
      </h1>

      {wishlistIds.length === 0 && !loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-primary)' }}>
          <p style={{ marginBottom: '16px' }}>Your wishlist is empty.</p>
          <a
            href="/discover"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-text-inverse)',
              color: 'var(--color-surface-base)',
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            Explore Movies to Add
          </a>
        </div>
      ) : (
        <MovieGrid
          movies={movies}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      )}
    </div>
  );
};
