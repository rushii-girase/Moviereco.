import React, { useState, useEffect, useCallback } from 'react';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

interface AwardCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const AWARD_CATEGORIES: AwardCategory[] = [
  { id: 'oscar-best-picture', name: 'Oscar — Best Picture', icon: '🏆', description: 'Academy Award for Best Picture winners' },
  { id: 'oscar-best-director', name: 'Oscar — Best Director', icon: '🎬', description: 'Academy Award for Best Director winners' },
  { id: 'cannes-palme', name: "Cannes — Palme d'Or", icon: '🌴', description: 'The highest prize at the Cannes Film Festival' },
  { id: 'venice-golden-lion', name: 'Venice — Golden Lion', icon: '🦁', description: 'Top award at the Venice International Film Festival' },
  { id: 'berlin-golden-bear', name: 'Berlin — Golden Bear', icon: '🐻', description: 'Best Film at the Berlin International Film Festival' },
  { id: 'bafta-best-film', name: 'BAFTA — Best Film', icon: '🎭', description: 'British Academy Film Award for Best Film' },
];

// Curated lists of notable award-winning movies by TMDB IDs
const AWARD_MOVIE_IDS: Record<string, number[]> = {
  'oscar-best-picture': [872585, 545611, 776503, 581734, 515001, 490132, 399055, 490132, 496243, 353081, 376867, 314365, 194662, 68718, 1640, 115, 597, 773, 122, 550, 424, 680, 13, 769, 207, 278],
  'oscar-best-director': [872585, 545611, 776503, 515001, 399055, 496243, 314365, 194662, 68718, 321612, 74643, 44214, 453, 1640, 115, 597, 122, 550, 424, 680],
  'cannes-palme': [614934, 496243, 496243, 68718, 194662, 45269, 1640, 14537, 153, 694, 592, 11216, 283, 946, 264644, 194],
  'venice-golden-lion': [872585, 475557, 497, 630, 11216, 153, 592, 283, 694, 946],
  'berlin-golden-bear': [64690, 1271, 1366, 857, 23397, 11216, 283, 946, 630],
  'bafta-best-film': [872585, 545611, 776503, 515001, 399055, 496243, 376867, 314365, 194662, 68718, 321612, 74643, 44214, 1640, 115, 597, 122, 550],
};

export const AwardsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<AwardCategory>(AWARD_CATEGORIES[0]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    const s = localStorage.getItem('wishlist');
    return s ? JSON.parse(s) : [];
  });

  const ITEMS_PER_PAGE = 12;

  const loadMovies = useCallback(async () => {
    setLoading(true);
    try {
      const ids = AWARD_MOVIE_IDS[selectedCategory.id] || [];
      const startIdx = page * ITEMS_PER_PAGE;
      const pageIds = ids.slice(startIdx, startIdx + ITEMS_PER_PAGE);

      const promises = pageIds.map((id) =>
        fetch(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}`)
          .then(r => r.json())
          .then(m => ({
            id: m.id,
            title: m.title,
            posterPath: m.poster_path,
            releaseYear: m.release_date ? parseInt(m.release_date.split('-')[0]) : undefined,
            rating: m.vote_average,
          }))
          .catch(() => null)
      );
      const results = (await Promise.all(promises)).filter(Boolean) as Movie[];
      setMovies(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, page]);

  useEffect(() => { loadMovies(); }, [loadMovies]);

  const handleToggleWishlist = (movieId: number, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlistIds((prev) => {
      const updated = prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const totalPages = Math.ceil((AWARD_MOVIE_IDS[selectedCategory.id]?.length || 0) / ITEMS_PER_PAGE);

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-13)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-6)' }}>
          <Trophy size={28} color="var(--color-text-inverse)" /> Awards & Festival Tracker
        </h1>
        <p style={{ color: 'var(--color-text-primary)', maxWidth: '700px' }}>
          Browse films that won cinema's most prestigious awards. From the Oscars to Cannes, Venice, and Berlin.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginBottom: 'var(--space-13)' }}>
        {AWARD_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat); setPage(0); }}
            style={{
              backgroundColor: selectedCategory.id === cat.id ? 'var(--color-surface-raised)' : 'transparent',
              border: selectedCategory.id === cat.id ? '1px solid var(--color-text-inverse)' : '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-6) var(--space-8)',
              color: selectedCategory.id === cat.id ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              fontWeight: selectedCategory.id === cat.id ? 600 : 400,
              transition: 'all var(--motion-duration-instant)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Category Description */}
      <div style={{
        backgroundColor: 'var(--color-surface-muted)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-10)',
        marginBottom: 'var(--space-10)',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
          {selectedCategory.icon} {selectedCategory.name}
        </h2>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
          {selectedCategory.description}
        </p>
      </div>

      <MovieGrid
        movies={movies}
        isLoading={loading}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', marginTop: 'var(--space-10)' }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-6) var(--space-8)',
              color: page === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
              cursor: page === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-6) var(--space-8)',
              color: page >= totalPages - 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
