import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchUpcomingMovies,
  fetchTopRatedMovies,
} from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Sparkles, Calendar, Star, Film, Bookmark, ChevronRight } from 'lucide-react';
import styles from './HomePage.module.css';

interface FeaturedMovie extends Movie {
  overview?: string;
  backdropPath?: string | null;
}

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);

  const [popular, setPopular] = useState<Movie[]>([]);

  const [upcoming, setUpcoming] = useState<Movie[]>([]);

  const [topRated, setTopRated] = useState<Movie[]>([]);

  const [featured, setFeatured] = useState<FeaturedMovie | null>(null);

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [trendData, popData, upData, topData] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchUpcomingMovies(),
          fetchTopRatedMovies(),
        ]);

        if (!isMounted) {
          return;
        }

        setTrending(trendData);
        setPopular(popData);
        setUpcoming(upData);
        setTopRated(topData);

        if (trendData.length > 0) {
          const topPick = trendData[0];

          setFeatured({
            ...topPick,
            overview:
              'Experience an acclaimed cinematic work leading world audiences this week. Explore directors, ratings, and behind-the-scenes artistry.',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleWishlist = (movieId: number, e: React.MouseEvent) => {
    e.preventDefault();

    setWishlistIds((prev) => {
      const isPresent = prev.includes(movieId);

      const updated = isPresent
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId];

      localStorage.setItem('wishlist', JSON.stringify(updated));

      return updated;
    });
  };

  const isFeaturedInWishlist = featured ? wishlistIds.includes(featured.id) : false;

  const heroBackdropUrl = featured?.posterPath
    ? `https://image.tmdb.org/t/p/original${featured.posterPath}`
    : null;

  return (
    <div className={styles.container}>
      {/* Cinematic Spotlight Hero */}
      {featured && (
        <section className={styles.hero} aria-label="Featured Film">
          {heroBackdropUrl && (
            <img
              src={heroBackdropUrl}
              alt={featured.title}
              className={styles.heroBackdrop}
            />
          )}

          <div className={styles.heroOverlay} />

          <div className={styles.heroContent}>
            <div className={styles.spotlightPill}>
              <Sparkles size={13} />
              <span>Spotlight Masterpiece</span>
            </div>

            <h1 className={styles.heroTitle}>{featured.title}</h1>

            <div className={styles.heroMeta}>
              {featured.releaseYear && <span>{featured.releaseYear}</span>}
              {featured.rating && featured.rating > 0 && (
                <div className={styles.heroRating}>
                  <Star size={15} fill="currentColor" />
                  <span>{featured.rating.toFixed(1)} TMDB Score</span>
                </div>
              )}
            </div>

            <p className={styles.heroOverview}>{featured.overview}</p>

            <div className={styles.heroActions}>
              <Link to={`/movie/${featured.id}`} className={styles.primaryBtn}>
                <Film size={16} />
                <span>Explore Film</span>
              </Link>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={(e) => handleToggleWishlist(featured.id, e)}
              >
                <Bookmark
                  size={16}
                  fill={isFeaturedInWishlist ? 'currentColor' : 'none'}
                />
                <span>
                  {isFeaturedInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Theatrical Premieres & Upcoming */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Calendar size={18} className={styles.sectionIcon} />
            <span>Theatrical Premieres &amp; Upcoming</span>
          </h2>
          <Link to="/discover" className={styles.viewAllLink}>
            <span>View All</span>
            <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
          </Link>
        </div>

        <MovieGrid
          movies={upcoming.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* Trending in World Cinema */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={18} className={styles.sectionIcon} />
            <span>Trending in World Cinema</span>
          </h2>
          <Link to="/discover" className={styles.viewAllLink}>
            <span>Explore More</span>
            <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
          </Link>
        </div>

        <MovieGrid
          movies={trending.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* Hall of Fame Masterpieces */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Star size={18} className={styles.sectionIcon} />
            <span>All-Time Acclaimed Masterpieces</span>
          </h2>
          <Link to="/top-lists" className={styles.viewAllLink}>
            <span>Top 250</span>
            <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
          </Link>
        </div>

        <MovieGrid
          movies={topRated.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* Global Audience Favorites */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Film size={18} className={styles.sectionIcon} />
            <span>Global Audience Favorites</span>
          </h2>
        </div>

        <MovieGrid
          movies={popular.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>
    </div>
  );
};
