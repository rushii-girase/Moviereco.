import React, { useEffect, useState } from 'react';
import { fetchTop250Movies, fetchPopularPeople } from '../api/tmdb';
import type { PersonDetails } from '../api/tmdb';
import { PersonModal } from '../components/PersonModal/PersonModal';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Award, UserCheck, Video } from 'lucide-react';

export const TopListsPage: React.FC = () => {
  const [tab, setTab] = useState<'top250' | 'directors' | 'actors'>('top250');
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [directors, setDirectors] = useState<PersonDetails[]>([]);
  const [actors, setActors] = useState<PersonDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [wishlistIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadTopLists = async () => {
      setLoading(true);
      try {
        if (tab === 'top250' && topMovies.length === 0) {
          const movies = await fetchTop250Movies();
          setTopMovies(movies);
        } else if (tab === 'directors' && directors.length === 0) {
          const people = await fetchPopularPeople('Directing');
          setDirectors(people);
        } else if (tab === 'actors' && actors.length === 0) {
          const people = await fetchPopularPeople('Acting');
          setActors(people);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTopLists();
  }, [tab]);

  const activePeople = tab === 'directors' ? directors : actors;

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Hall of Fame & All-Time Best
          </h1>
          <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            {tab === 'top250' ? `Showing Top 250 Highest Rated Movies of All Time` : `Top ${tab} & Their Masterpieces`}
          </p>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)', padding: '4px', border: '1px solid var(--color-border-subtle)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setTab('top250')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: tab === 'top250' ? 'var(--color-text-inverse)' : 'transparent',
              color: tab === 'top250' ? 'var(--color-surface-base)' : 'var(--color-text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Award size={16} /> Top 250 Movies
          </button>
          <button
            onClick={() => setTab('directors')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: tab === 'directors' ? 'var(--color-text-inverse)' : 'transparent',
              color: tab === 'directors' ? 'var(--color-surface-base)' : 'var(--color-text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Video size={16} /> Legendary Directors
          </button>
          <button
            onClick={() => setTab('actors')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              backgroundColor: tab === 'actors' ? 'var(--color-text-inverse)' : 'transparent',
              color: tab === 'actors' ? 'var(--color-surface-base)' : 'var(--color-text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <UserCheck size={16} /> Popular Actors
          </button>
        </div>
      </div>

      {tab === 'top250' ? (
        <MovieGrid movies={topMovies} isLoading={loading} wishlistIds={wishlistIds} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-10)' }}>
          {loading ? (
            <p style={{ color: 'var(--color-text-primary)' }}>Loading {tab}...</p>
          ) : (
            activePeople.map((person) => (
              <div
                key={person.id}
                onClick={() => setSelectedPersonId(person.id)}
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  padding: 'var(--space-8)',
                  display: 'flex',
                  gap: 'var(--space-8)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ width: '85px', height: '110px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--color-surface-muted)', flexShrink: 0 }}>
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                      alt={person.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                      No Photo
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-inverse)', marginBottom: '4px' }}>
                    {person.name} ↗
                  </h3>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', display: 'block', marginBottom: '8px' }}>
                    {person.known_for_department}
                  </span>

                  <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>
                    Best Known For:
                  </strong>
                  <ul style={{ paddingLeft: '16px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', margin: '4px 0 0 0' }}>
                    {person.known_for?.slice(0, 3).map((work) => (
                      <li key={work.id}>{work.title || work.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <PersonModal personId={selectedPersonId} onClose={() => setSelectedPersonId(null)} />
    </div>
  );
};
