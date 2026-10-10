import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, User as UserIcon } from 'lucide-react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(value.trim())}&page=1`);
        const data = await res.json();
        setResults((data.results || []).slice(0, 8));
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
    if (result.media_type === 'person') {
      // Could navigate to person page, for now stay
      return;
    }
    const mediaType = result.media_type === 'tv' ? 'tv' : 'movie';
    navigate(`/movie/${result.id}?type=${mediaType}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film size={14} />;
      case 'tv': return <Tv size={14} />;
      case 'person': return <UserIcon size={14} />;
      default: return <Film size={14} />;
    }
  };

  const getImageUrl = (result: SearchResult) => {
    const path = result.poster_path || result.profile_path;
    return path ? `https://image.tmdb.org/t/p/w92${path}` : null;
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        backgroundColor: 'var(--color-surface-muted)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '0 var(--space-6)',
        transition: 'border-color var(--motion-duration-instant)',
      }}>
        <Search size={16} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search movies, TV, people…"
          style={{
            flex: 1, border: 'none', background: 'transparent',
            padding: 'var(--space-5) var(--space-6)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            outline: 'none',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', padding: '2px' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-sm)',
          marginTop: '4px',
          maxHeight: '400px', overflowY: 'auto',
          zIndex: 100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {loading && (
            <div style={{ padding: 'var(--space-6) var(--space-8)', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
              Searching…
            </div>
          )}
          {!loading && results.length === 0 && (
            <div style={{ padding: 'var(--space-6) var(--space-8)', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
              No results found
            </div>
          )}
          {results.map((result) => {
            const imgUrl = getImageUrl(result);
            const title = result.title || result.name || '';
            const year = (result.release_date || result.first_air_date)?.split('-')[0];

            return (
              <button
                key={`${result.media_type}-${result.id}`}
                onClick={() => handleSelect(result)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-6)',
                  width: '100%', padding: 'var(--space-5) var(--space-8)',
                  background: 'transparent', border: 'none',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background var(--motion-duration-instant)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {imgUrl ? (
                  <img src={imgUrl} alt="" style={{ width: '36px', height: '54px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '36px', height: '54px', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getIcon(result.media_type)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                    {getIcon(result.media_type)}
                    <span style={{ textTransform: 'capitalize' }}>{result.media_type}</span>
                    {year && <span>· {year}</span>}
                    {result.vote_average != null && result.vote_average > 0 && (
                      <span>· ⭐ {result.vote_average.toFixed(1)}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
