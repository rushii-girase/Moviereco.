import React, { useState, useEffect } from 'react';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import styles from './AwardsPage.module.css';

const TMDB_BASE = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

interface AwardCategory {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
}

const AWARD_CATEGORIES: readonly AwardCategory[] = [
  {
    id: 'oscar-best-picture',
    name: 'Oscar: Best Picture',
    icon: '🏆',
    description: 'Academy Award for Best Picture winners across cinema history',
  },
  {
    id: 'oscar-best-director',
    name: 'Oscar: Best Director',
    icon: '🎬',
    description: 'Academy Award for visionary Best Director laureates',
  },
  {
    id: 'cannes-palme',
    name: "Cannes: Palme d'Or",
    icon: '🌴',
    description: 'The highest honor of world cinema awarded at Festival de Cannes',
  },
  {
    id: 'venice-golden-lion',
    name: 'Venice: Golden Lion',
    icon: '🦁',
    description: 'The pinnacle trophy of the world’s oldest film festival',
  },
  {
    id: 'berlin-golden-bear',
    name: 'Berlin: Golden Bear',
    icon: '🐻',
    description: 'Grand prize laureate at the Berlin International Film Festival',
  },
  {
    id: 'bafta-best-film',
    name: 'BAFTA: Best Film',
    icon: '🎭',
    description: 'British Academy Film Award honoring outstanding cinema works',
  },
] as const;

// Curated lists of notable award-winning movies by TMDB IDs
const AWARD_MOVIE_IDS = {
  'oscar-best-picture': [
    872585, 545611, 776503, 581734, 515001, 490132, 399055, 496243, 353081,
    376867, 314365, 194662, 68718, 1640, 115, 597, 773, 122, 550, 424, 680, 13,
    769, 207, 278,
  ],
  'oscar-best-director': [
    872585, 545611, 776503, 515001, 399055, 496243, 314365, 194662, 68718,
    321612, 74643, 44214, 453, 1640, 115, 597, 122, 550, 424, 680,
  ],
  'cannes-palme': [
    614934, 496243, 68718, 194662, 45269, 1640, 14537, 153, 694, 592, 11216,
    283, 946, 264644, 194,
  ],
  'venice-golden-lion': [
    872585, 475557, 497, 630, 11216, 153, 592, 283, 694, 946,
  ],
  'berlin-golden-bear': [
    64690, 1271, 1366, 857, 23397, 11216, 283, 946, 630,
  ],
  'bafta-best-film': [
    872585, 545611, 776503, 515001, 399055, 496243, 376867, 314365, 194662,
    68718, 321612, 74643, 44214, 1640, 115, 597, 122, 550,
  ],
} as const;

export const AwardsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<AwardCategory>(AWARD_CATEGORIES[0]);

  const [movies, setMovies] = useState<Movie[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);

  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    const s = localStorage.getItem('wishlist');

    if (!s) {
      return [];
    }

    try {
      return JSON.parse(s);
    } catch {
      return [];
    }
  });

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    let ignore = false;

    // SAFETY: Category id comes from constant AWARD_CATEGORIES which map directly to keys of AWARD_MOVIE_IDS
    const ids = AWARD_MOVIE_IDS[selectedCategory.id as keyof typeof AWARD_MOVIE_IDS] || [];
    const startIdx = page * ITEMS_PER_PAGE;
    const pageIds = ids.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const promises = pageIds.map((id) =>
      fetch(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}`)
        .then((r) => {
          if (!r.ok) {
            return null;
          }

          return r.json();
        })
        .then((m) => {
          if (!m || !m.id) {
            return null;
          }

          const parsedYear = m.release_date
            ? parseInt(m.release_date.split('-')[0], 10)
            : undefined;

          const movieItem: Movie = {
            id: m.id,
            title: m.title,
            posterPath: m.poster_path,
            releaseYear: parsedYear,
            rating: m.vote_average,
          };

          return movieItem;
        })
        .catch(() => null),
    );

    Promise.all(promises)
      .then((fetched) => {
        if (!ignore) {
          // SAFETY: Filter out null results from network errors into typed Movie array
          const validMovies = fetched.filter((m): m is Movie => m !== null);

          setMovies(validMovies);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedCategory.id, page]);

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

  // SAFETY: Category id comes from constant AWARD_CATEGORIES which map directly to keys of AWARD_MOVIE_IDS
  const currentIds = AWARD_MOVIE_IDS[selectedCategory.id as keyof typeof AWARD_MOVIE_IDS] || [];
  const totalPages = Math.ceil(currentIds.length / ITEMS_PER_PAGE);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Festival Laurels &amp; Academy Honors</h1>
        <p className={styles.subtitle}>
          Celebrate the pinnacle of world cinema recognized by premier global film juries.
        </p>
      </header>

      {/* Categories Grid */}
      <section className={styles.categoriesGrid} aria-label="Award Categories">
        {AWARD_CATEGORIES.map((category) => {
          const isSelected = selectedCategory.id === category.id;

          return (
            <button
              key={category.id}
              type="button"
              className={`${styles.categoryBtn} ${isSelected ? styles.active : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setPage(0);
                setLoading(true);
              }}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryName}>{category.name}</span>
            </button>
          );
        })}
      </section>

      {/* Laureate Section */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Trophy size={18} style={{ color: 'var(--color-accent-gold)', marginRight: '8px' }} />
          {selectedCategory.name} Laureates
        </h2>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => {
                setPage((p) => Math.max(0, p - 1));
                setLoading(true);
              }}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span className={styles.pageIndicator}>
              Page {page + 1} of {totalPages}
            </span>

            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => {
                setPage((p) => Math.min(totalPages - 1, p + 1));
                setLoading(true);
              }}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <MovieGrid
        movies={movies}
        isLoading={loading}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  );
};
