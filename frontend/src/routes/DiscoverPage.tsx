import React, { useEffect, useState } from 'react';
import { discoverMedia, fetchGenres } from '../api/tmdb';
import type { Genre } from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Filter, Search, Dices, Tv, Film } from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchGenres(mediaType).then(setGenres).catch(console.error);
  }, [mediaType]);

  const handleSearch = async (e?: React.FormEvent, random = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await discoverMedia({
        mediaType,
        genreId: selectedGenre,
        year: selectedYear,
        minRating,
        language,
        country,
        query,
        random,
      });
      setMovies(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [mediaType, selectedGenre, selectedYear, minRating, language, country]);

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

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-10)' }}>
      {/* Header & Media Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', margin: 0 }}>
          Discover {mediaType === 'movie' ? 'Movies' : 'TV Shows & Series'}
        </h1>

        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)', padding: '4px', border: '1px solid var(--color-border-subtle)' }}>
          <button
            onClick={() => setMediaType('movie')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: mediaType === 'movie' ? 'var(--color-text-inverse)' : 'transparent',
              color: mediaType === 'movie' ? 'var(--color-surface-base)' : 'var(--color-text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Film size={16} /> Movies
          </button>
          <button
            onClick={() => setMediaType('tv')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: mediaType === 'tv' ? 'var(--color-text-inverse)' : 'transparent',
              color: mediaType === 'tv' ? 'var(--color-surface-base)' : 'var(--color-text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Tv size={16} /> TV Shows & Series
          </button>
        </div>
      </div>

      {/* Random 20 Refresh Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-text-inverse)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: 'var(--space-10)',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => handleSearch(undefined, true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-text-inverse)',
            color: 'var(--color-surface-base)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 20px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Dices size={18} /> Refresh Random 20 {mediaType === 'movie' ? 'Movies' : 'Shows'}
        </button>

        <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>Quick Genre:</span>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{
            backgroundColor: 'var(--color-surface-muted)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
          }}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id.toString()}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-10)',
          marginBottom: 'var(--space-12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)',
        }}
      >
        <form onSubmit={(e) => handleSearch(e)} style={{ display: 'flex', gap: 'var(--space-6)' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <input
              type="text"
              placeholder={`Search ${mediaType === 'movie' ? 'movies, actors, or directors...' : 'TV shows & series...'}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-6) var(--space-10)',
                color: 'var(--color-text-secondary)',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--color-text-inverse)',
              color: 'var(--color-surface-base)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0 var(--space-10)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Search size={16} /> Search
          </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-primary)' }}>
            <Filter size={16} /> Advanced Filters:
          </div>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4) var(--space-6)',
            }}
          >
            <option value="">Release Year</option>
            {Array.from({ length: 35 }, (_, i) => (2026 - i).toString()).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4) var(--space-6)',
            }}
          >
            <option value="">Min Rating</option>
            <option value="8">8+ Stars ⭐</option>
            <option value="7">7+ Stars ⭐</option>
            <option value="6">6+ Stars ⭐</option>
          </select>

          {/* Language Filter */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4) var(--space-6)',
            }}
          >
            <option value="">Language</option>
            <option value="en">English 🇬🇧</option>
            <option value="hi">Hindi 🇮🇳</option>
            <option value="ja">Japanese 🇯🇵</option>
            <option value="ko">Korean 🇰🇷</option>
            <option value="es">Spanish 🇪🇸</option>
            <option value="fr">French 🇫🇷</option>
            <option value="de">German 🇩🇪</option>
          </select>

          {/* Country Filter */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4) var(--space-6)',
            }}
          >
            <option value="">Origin Country</option>
            <option value="US">United States 🇺🇸</option>
            <option value="IN">India 🇮🇳</option>
            <option value="JP">Japan 🇯🇵</option>
            <option value="GB">United Kingdom 🇬🇧</option>
            <option value="KR">South Korea 🇰🇷</option>
            <option value="FR">France 🇫🇷</option>
          </select>
        </div>
      </div>

      {/* Grid Results */}
      <MovieGrid
        movies={movies}
        isLoading={loading}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  );
};
