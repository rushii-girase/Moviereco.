import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMovieDetails } from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Bookmark, Compass } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('wishlist');

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState<boolean>(() => wishlistIds.length > 0);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      return;
    }

    let isMounted = true;

    const moviePromises = wishlistIds.map((id) =>
      fetchMovieDetails(id.toString())
        .then((d) => ({
          id: d.id,
          title: d.title || d.name || 'Untitled',
          posterPath: d.poster_path,
          releaseYear: d.release_date
            ? parseInt(d.release_date.split('-')[0], 10)
            : undefined,
          rating: d.vote_average,
        }))
        .catch(() => null),
    );

    Promise.all(moviePromises)
      .then((results) => {
        if (isMounted) {
          const valid = results.filter((m): m is Movie => m !== null);

          setMovies(valid);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [wishlistIds]);

  const handleToggleWishlist = (movieId: number, e: React.MouseEvent) => {
    e.preventDefault();

    setWishlistIds((prev) => {
      const updated = prev.filter((id) => id !== movieId);

      localStorage.setItem('wishlist', JSON.stringify(updated));

      return updated;
    });

    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isEmpty = wishlistIds.length === 0;

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-8) var(--space-12) var(--space-8)' }}>
      <header style={{ marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', fontWeight: 600, letterSpacing: '0.01em', marginBottom: 'var(--space-2)' }}>
          Watchlist
        </h1>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-family-mono)' }}>
          {wishlistIds.length} {wishlistIds.length === 1 ? 'title' : 'titles'} saved
        </p>
      </header>

      {isEmpty && !loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-8)',
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <Bookmark size={32} style={{ color: 'var(--color-text-tertiary)' }} />
          <div>
            <h2 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
              Your watchlist is empty
            </h2>
            <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', maxWidth: '400px' }}>
              Bookmark films from discover or top-rated lists to queue them here
            </p>
          </div>

          <Link
            to="/discover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-secondary)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <Compass size={15} />
            <span>Discover films</span>
          </Link>
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
