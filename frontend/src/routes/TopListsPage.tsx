import React, { useEffect, useState } from 'react';
import { fetchTop250Movies, fetchPopularPeople } from '../api/tmdb';
import type { PersonDetails } from '../api/tmdb';
import { PersonModal } from '../components/PersonModal/PersonModal';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Trophy, Clapperboard, Users, User } from 'lucide-react';
import styles from './TopListsPage.module.css';

export const TopListsPage: React.FC = () => {
  const [tab, setTab] = useState<'top250' | 'directors' | 'actors'>('top250');

  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  const [directors, setDirectors] = useState<PersonDetails[]>([]);

  const [actors, setActors] = useState<PersonDetails[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const [wishlistIds] = useState<number[]>(() => {
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
    let ignore = false;

    const loadData = async () => {
      try {
        if (tab === 'top250') {
          if (topMovies.length === 0) {
            const movies = await fetchTop250Movies();

            if (!ignore) {
              setTopMovies(movies);
            }
          }
        } else if (tab === 'directors') {
          if (directors.length === 0) {
            const people = await fetchPopularPeople('Directing');

            if (!ignore) {
              setDirectors(people);
            }
          }
        } else if (tab === 'actors') {
          if (actors.length === 0) {
            const people = await fetchPopularPeople('Acting');

            if (!ignore) {
              setActors(people);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [tab, topMovies.length, directors.length, actors.length]);

  const activePeople = tab === 'directors' ? directors : actors;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Cinema Hall of Fame</h1>
          <p className={styles.subtitle}>
            {tab === 'top250'
              ? 'The Top 250 highest rated films in cinematic history.'
              : `Renowned ${tab} whose masterworks shaped modern cinema.`}
          </p>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Hall of Fame Sections">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'top250'}
            className={`${styles.tabBtn} ${tab === 'top250' ? styles.active : ''}`}
            onClick={() => setTab('top250')}
          >
            <Trophy size={14} />
            <span>Top 250 Films</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'directors'}
            className={`${styles.tabBtn} ${tab === 'directors' ? styles.active : ''}`}
            onClick={() => setTab('directors')}
          >
            <Clapperboard size={14} />
            <span>Auteurs &amp; Directors</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'actors'}
            className={`${styles.tabBtn} ${tab === 'actors' ? styles.active : ''}`}
            onClick={() => setTab('actors')}
          >
            <Users size={14} />
            <span>Celebrated Actors</span>
          </button>
        </div>
      </header>

      {tab === 'top250' ? (
        <MovieGrid
          movies={topMovies}
          isLoading={loading}
          wishlistIds={wishlistIds}
        />
      ) : (
        <div className={styles.personGrid}>
          {activePeople.map((person) => {
            const photoUrl = person.profile_path
              ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
              : null;

            return (
              <button
                key={person.id}
                type="button"
                className={styles.personCard}
                onClick={() => setSelectedPersonId(person.id)}
              >
                <div className={styles.photoWrapper}>
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={person.name}
                      className={styles.personPhoto}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.personPlaceholder}>
                      <User size={32} />
                    </div>
                  )}
                </div>

                <div className={styles.personContent}>
                  <span className={styles.personName}>{person.name}</span>
                  <span className={styles.personRole}>{person.known_for_department}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedPersonId && (
        <PersonModal
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
        />
      )}
    </div>
  );
};
