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
import { Calendar, Star, Film, Bookmark, ChevronRight } from 'lucide-react';
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
          setFeatured(topPick);
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

  const heroBackdropUrl = featured?.backdropPath
    ? `https://image.tmdb.org/t/p/original${featured.backdropPath}`
    : featured?.posterPath
    ? `https://image.tmdb.org/t/p/original${featured.posterPath}`
    : null;

  return (
    <div className={styles.container}>
      {/* Featured Archival Presentation */}
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
            <div className={styles.spotlightTag}>
              <span className={styles.signatureIndex}>35MM ARCHIVE</span>
              <span className={styles.signatureDot}>•</span>
              <span>Featured Presentation</span>
            </div>

            <h1 className={styles.heroTitle}>{featured.title}</h1>

            <div className={styles.heroMeta}>
              {featured.releaseYear && <span className={styles.metaYear}>{featured.releaseYear}</span>}
              {featured.rating && featured.rating > 0 && (
                <div className={styles.heroRating}>
                  <Star size={13} fill="currentColor" />
                  <span className={styles.ratingValue}>{featured.rating.toFixed(1)}</span>
                  <span className={styles.ratingScale}>/ 10</span>
                </div>
              )}
            </div>

            {featured.overview && <p className={styles.heroOverview}>{featured.overview}</p>}

            <div className={styles.heroActions}>
              <Link to={`/movie/${featured.id}`} className={styles.primaryBtn}>
                <Film size={15} />
                <span>Film Details</span>
              </Link>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={(e) => handleToggleWishlist(featured.id, e)}
              >
                <Bookmark
                  size={15}
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
            <Calendar size={16} className={styles.sectionIcon} />
            <span>Upcoming Releases</span>
          </h2>
          <Link to="/discover" className={styles.viewAllLink}>
            <span>View all</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <MovieGrid
          movies={upcoming.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* Trending This Week */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Film size={16} className={styles.sectionIcon} />
            <span>Trending This Week</span>
          </h2>
          <Link to="/discover" className={styles.viewAllLink}>
            <span>View all</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <MovieGrid
          movies={trending.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* All-Time Top Rated */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Star size={16} className={styles.sectionIcon} />
            <span>Top Rated</span>
          </h2>
          <Link to="/top-lists" className={styles.viewAllLink}>
            <span>View all</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <MovieGrid
          movies={topRated.slice(0, 6)}
          isLoading={loading}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/* Popular Releases */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Film size={16} className={styles.sectionIcon} />
            <span>Popular Releases</span>
          </h2>
          <Link to="/discover" className={styles.viewAllLink}>
            <span>View all</span>
            <ChevronRight size={14} />
          </Link>
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
