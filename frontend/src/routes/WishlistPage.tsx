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
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-10) var(--space-13) var(--space-10)' }}>
      <header style={{ marginBottom: 'var(--space-10)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', fontWeight: 700, letterSpacing: '0.02em', marginBottom: 'var(--space-2)' }}>
          My Cinema Watchlist
        </h1>
        <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
          Saved titles queued for upcoming screenings ({wishlistIds.length} titles).
        </p>
      </header>

      {isEmpty && !loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-13) var(--space-10)',
            backgroundColor: 'var(--color-surface-card)',
            border: '1px dashed var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-5)',
          }}
        >
          <Bookmark size={40} style={{ color: 'var(--color-text-tertiary)' }} />
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              Your Watchlist is Empty
            </h2>
            <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', maxWidth: '440px' }}>
              Explore world cinema, award winners, and cinematic eras to bookmark films for later viewing.
            </p>
          </div>

          <Link
            to="/discover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              backgroundColor: 'var(--color-accent-gold)',
              color: '#08090b',
              padding: '11px 24px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <Compass size={16} />
            <span>Discover Masterpieces</span>
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
