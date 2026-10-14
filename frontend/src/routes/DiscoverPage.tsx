import React, { useEffect, useState, useCallback } from 'react';
import { discoverMedia, fetchGenres } from '../api/tmdb';
import type { Genre } from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Film, Tv, Dices, RotateCcw } from 'lucide-react';
import styles from './DiscoverPage.module.css';

export const DiscoverPage: React.FC = () => {
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');

  const [genres, setGenres] = useState<Genre[]>([]);

  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const [selectedYear, setSelectedYear] = useState<string>('');

  const [minRating, setMinRating] = useState<string>('');

  const [language, setLanguage] = useState<string>('');

  const [movies, setMovies] = useState<Movie[]>([]);

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

  // Load genres when mediaType changes
  useEffect(() => {
    let isMounted = true;

    fetchGenres(mediaType)
      .then((data) => {
        if (isMounted) {
          setGenres(data);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [mediaType]);

  const executeSearch = useCallback(
    async (random = false) => {
      setLoading(true);

      try {
        const data = await discoverMedia({
          mediaType,
          genreId: selectedGenre || undefined,
          year: selectedYear || undefined,
          minRating: minRating || undefined,
          language: language || undefined,
          random,
        });

        setMovies(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [mediaType, selectedGenre, selectedYear, minRating, language],
  );

  useEffect(() => {
    let ignore = false;

    discoverMedia({
      mediaType,
      genreId: selectedGenre || undefined,
      year: selectedYear || undefined,
      minRating: minRating || undefined,
      language: language || undefined,
    })
      .then((data) => {
        if (!ignore) {
          setMovies(data.results);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [mediaType, selectedGenre, selectedYear, minRating, language]);

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

  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setMinRating('');
    setLanguage('');
  };

  const hasActiveFilters = Boolean(selectedGenre || selectedYear || minRating || language);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Cinema Discovery Lab</h1>
          <p className={styles.subtitle}>
            Explore thousands of cinematic works across decades, genres, and world languages.
          </p>
        </div>

        <div className={styles.mediaToggle} role="group" aria-label="Media format selector">
          <button
            type="button"
            className={`${styles.toggleBtn} ${mediaType === 'movie' ? styles.active : ''}`}
            onClick={() => {
              setMediaType('movie');
              setSelectedGenre('');
            }}
          >
            <Film size={14} />
            <span>Feature Films</span>
          </button>

          <button
            type="button"
            className={`${styles.toggleBtn} ${mediaType === 'tv' ? styles.active : ''}`}
            onClick={() => {
              setMediaType('tv');
              setSelectedGenre('');
            }}
          >
            <Tv size={14} />
            <span>Series &amp; TV</span>
          </button>
        </div>
      </header>

      {/* Filter Console */}
      <section className={styles.filterConsole} aria-label="Discovery Filters">
        {/* Genre Pill Rack */}
        <div className={styles.genreRack} role="group" aria-label="Select Genre">
          <button
            type="button"
            className={`${styles.genrePill} ${selectedGenre === '' ? styles.active : ''}`}
            onClick={() => setSelectedGenre('')}
          >
            All Genres
          </button>

          {genres.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`${styles.genrePill} ${selectedGenre === String(g.id) ? styles.active : ''}`}
              onClick={() => setSelectedGenre(selectedGenre === String(g.id) ? '' : String(g.id))}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Dropdowns & Roulette Row */}
        <div className={styles.controlsRow}>
          <div className={styles.dropdownGroup}>
            <select
              className={styles.select}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="Filter by release year or decade"
            >
              <option value="">Any Year</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2020">2020s</option>
              <option value="2010">2010s</option>
              <option value="2000">2000s</option>
              <option value="1990">1990s</option>
              <option value="1980">1980s</option>
              <option value="1970">1970s</option>
              <option value="1960">1960s</option>
              <option value="1950">1950s &amp; Classic</option>
            </select>

            <select
              className={styles.select}
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              aria-label="Filter by minimum score"
            >
              <option value="">Any Score</option>
              <option value="8.5">8.5+ Masterpiece</option>
              <option value="8">8.0+ Critical Acclaim</option>
              <option value="7.5">7.5+ Highly Regarded</option>
              <option value="7">7.0+ Recommended</option>
              <option value="6">6.0+ Decent</option>
            </select>

            <select
              className={styles.select}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Filter by original language"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="fr">French (Français)</option>
              <option value="ja">Japanese (日本語)</option>
              <option value="ko">Korean (한국어)</option>
              <option value="it">Italian (Italiano)</option>
              <option value="es">Spanish (Español)</option>
              <option value="de">German (Deutsch)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="zh">Chinese (中文)</option>
              <option value="sv">Swedish (Svenska)</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                className={styles.select}
                onClick={handleResetFilters}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <button
            type="button"
            className={styles.rouletteBtn}
            onClick={() => executeSearch(true)}
            title="Spin the cinema roulette for a random critically acclaimed film"
          >
            <Dices size={16} />
            <span>Cinema Roulette</span>
          </button>
        </div>
      </section>

      {/* Results Header */}
      <div className={styles.resultsMeta}>
        <span>Showing {movies.length} {mediaType === 'tv' ? 'series' : 'titles'}</span>
      </div>

      {/* Grid */}
      <MovieGrid
        movies={movies}
        isLoading={loading}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  );
};
