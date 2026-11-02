import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, Star } from 'lucide-react';
import styles from './SearchAutocomplete.module.css';

const TMDB_BASE = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string | null;
  profile_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

export const SearchAutocomplete: React.FC = () => {
  const [query, setQuery] = useState('');

  const [results, setResults] = useState<SearchResult[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // SAFETY: DOM click event target implements the Node interface
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);

      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${TMDB_BASE}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(value.trim())}&page=1`,
        );

        if (!res.ok) {
          throw new Error('Search failed');
        }

        const data = await res.json();

        const validResults = (data.results || []).filter(
          (item: SearchResult) => item.media_type === 'movie' || item.media_type === 'tv',
        );

        setResults(validResults.slice(0, 8));
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');

    const mediaType = result.media_type === 'tv' ? 'tv' : 'movie';

    navigate(`/movie/${result.id}?type=${mediaType}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.searchBar}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.input}
          placeholder="Search films, directors..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
            }
          }}
          aria-label="Search movies and series"
        />
        {query && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={clearQuery}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {loading && results.length === 0 ? (
            <div className={styles.emptyState}>Searching library...</div>
          ) : results.length > 0 ? (
            results.map((result) => {
              const displayTitle = result.title || result.name || 'Untitled';
              const releaseDate = result.release_date || result.first_air_date;
              const year = releaseDate ? releaseDate.slice(0, 4) : '';
              const isTv = result.media_type === 'tv';

              const poster = result.poster_path
                ? `https://image.tmdb.org/t/p/w92${result.poster_path}`
                : null;

              return (
                <button
                  key={`${result.media_type}-${result.id}`}
                  type="button"
                  className={styles.item}
                  onClick={() => handleSelect(result)}
                  role="option"
                  aria-selected="false"
                >
                  {poster ? (
                    <img
                      src={poster}
                      alt={displayTitle}
                      className={styles.thumbnail}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.placeholderThumb}>
                      {isTv ? <Tv size={16} /> : <Film size={16} />}
                    </div>
                  )}

                  <div className={styles.info}>
                    <span className={styles.title}>{displayTitle}</span>
                    <div className={styles.metaRow}>
                      <span className={styles.badge}>
                        {isTv ? <Tv size={10} /> : <Film size={10} />}
                        {isTv ? 'Series' : 'Film'}
                      </span>
                      {year && <span>{year}</span>}
                      {result.vote_average && result.vote_average > 0 ? (
                        <span className={styles.rating}>
                          <Star size={11} fill="currentColor" />
                          {result.vote_average.toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className={styles.emptyState}>No titles found for &ldquo;{query}&rdquo;</div>
          )}
        </div>
      )}
    </div>
  );
};
