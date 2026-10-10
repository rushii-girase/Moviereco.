import React, { useEffect, useState } from 'react';
import { fetchTrendingMovies, fetchPopularMovies, fetchUpcomingMovies, fetchTopRatedMovies } from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Sparkles, Calendar, Award } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendData, popData, upData, topData] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchUpcomingMovies(),
          fetchTopRatedMovies(),
        ]);
        setTrending(trendData);
        setPopular(popData);
        setUpcoming(upData);
        setTopRated(topData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleWishlist = (movieId: number, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlistIds((prev) => {
      const updated = prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const featured = trending[0];

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: '0 var(--space-10)' }}>
      {/* Hero Banner */}
      {featured && (
        <section
          style={{
            position: 'relative',
            margin: 'var(--space-10) 0 var(--space-13) 0',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border-subtle)',
            padding: 'var(--space-13)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-inverse)', fontWeight: 600 }}>
            <Sparkles size={18} /> Trending #1 This Week
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)' }}>
            {featured.title}
          </h1>
          <p style={{ color: 'var(--color-text-primary)', maxWidth: '600px' }}>
            Explore categories, release years, ratings, actors, directors, and upcoming trailers to find your next movie.
          </p>
        </section>
      )}

      {/* Upcoming Movies */}
      <section style={{ marginBottom: 'var(--space-13)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--color-text-inverse)" /> Upcoming Movies & Cinema Releases
        </h2>
        <MovieGrid
          movies={upcoming.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* Trending Row */}
      <section style={{ marginBottom: 'var(--space-13)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)' }}>
          Trending This Week
        </h2>
        <MovieGrid
          movies={trending}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* All Time Top Rated */}
      <section style={{ marginBottom: 'var(--space-13)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="var(--color-text-inverse)" /> Highest Rated Movies of All Time
        </h2>
        <MovieGrid
          movies={topRated.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* Popular Row */}
      <section style={{ marginBottom: 'var(--space-13)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)' }}>
          All Time Popular
        </h2>
        <MovieGrid
          movies={popular}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>
    </div>
  );
};
