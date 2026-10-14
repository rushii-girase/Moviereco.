import React, { useState } from 'react';
import { discoverMedia } from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Layers } from 'lucide-react';
import styles from './FilmMovementsPage.module.css';

interface FilmMovement {
  id: string;
  name: string;
  era: string;
  description: string;
  genreId?: string;
  country?: string;
  yearStart: string;
  yearEnd: string;
}

const FILM_MOVEMENTS: readonly FilmMovement[] = [
  {
    id: 'french-new-wave',
    name: 'French New Wave',
    era: '1958–1973',
    description: 'Radical visual experimentation by Godard, Truffaut, and Varda. Handheld cameras, jump cuts, and location shooting.',
    country: 'FR',
    yearStart: '1958',
    yearEnd: '1973',
  },
  {
    id: 'italian-neorealism',
    name: 'Italian Neorealism',
    era: '1943–1955',
    description: 'Post-war Italy captured by De Sica and Rossellini. Non-professional actors, real street locations, and human realism.',
    country: 'IT',
    yearStart: '1943',
    yearEnd: '1955',
  },
  {
    id: 'german-expressionism',
    name: 'German Expressionism',
    era: '1920–1930',
    description: 'Distorted architectural sets, geometric shadows, and psychological chiaroscuro lighting.',
    country: 'DE',
    yearStart: '1920',
    yearEnd: '1930',
  },
  {
    id: 'korean-golden-age',
    name: 'Korean Cinema Renaissance',
    era: '2000–Present',
    description: 'Park Chan-wook, Bong Joon-ho, and Lee Chang-dong. Genre-defying visual precision and philosophical thrillers.',
    country: 'KR',
    yearStart: '2000',
    yearEnd: '2026',
  },
  {
    id: 'japanese-golden-age',
    name: 'Japanese Golden Age',
    era: '1950–1970',
    description: 'Kurosawa, Ozu, and Mizoguchi. Seven Samurai, Tokyo Story, and Rashomon established timeless cinematic grammar.',
    country: 'JP',
    yearStart: '1950',
    yearEnd: '1970',
  },
  {
    id: 'hollywood-new-wave',
    name: 'New Hollywood',
    era: '1967–1980',
    description: 'Scorsese, Coppola, and Kubrick broke classic studio conventions with gritty, auteur-driven narratives.',
    country: 'US',
    yearStart: '1967',
    yearEnd: '1980',
  },
  {
    id: 'bollywood-parallel',
    name: 'Indian Parallel Cinema',
    era: '1950–1990',
    description: 'Satyajit Ray, Ritwik Ghatak, and Mrinal Sen. Poetic realism and social consciousness that won global festival acclaim.',
    country: 'IN',
    yearStart: '1950',
    yearEnd: '1990',
  },
  {
    id: 'soviet-montage',
    name: 'Soviet Montage School',
    era: '1920–1933',
    description: 'Eisenstein, Vertov, and Pudovkin invented intellectual juxtaposition and revolutionary editing techniques.',
    country: 'RU',
    yearStart: '1920',
    yearEnd: '1933',
  },
  {
    id: 'hong-kong-action',
    name: 'Hong Kong Golden Era',
    era: '1970–2000',
    description: 'Wong Kar-wai and John Woo blended hypnotic kinetic choreography with melancholic neon poetry.',
    country: 'HK',
    yearStart: '1970',
    yearEnd: '2000',
    genreId: '28',
  },
  {
    id: 'nordic-noir',
    name: 'Nordic Noir & Atmosphere',
    era: '2005–Present',
    description: 'Sub-zero psychological tension, stark winter landscapes, and uncompromising sociological character studies.',
    country: 'SE',
    yearStart: '2005',
    yearEnd: '2026',
    genreId: '80',
  },
  {
    id: 'brazilian-cinema-novo',
    name: 'Brazilian Cinema Novo',
    era: '1960–1972',
    description: 'Glauber Rocha led an aesthetic rebellion against commercial sterility with symbolic poetry and political urgency.',
    country: 'BR',
    yearStart: '1960',
    yearEnd: '1972',
  },
  {
    id: 'iranian-new-wave',
    name: 'Iranian New Wave',
    era: '1960–Present',
    description: 'Kiarostami, Farhadi, and Panahi. Lyrical humanism, self-reflexive narratives, and moral complexity.',
    country: 'IR',
    yearStart: '1960',
    yearEnd: '2026',
  },
] as const;

export const FilmMovementsPage: React.FC = () => {
  const [selected, setSelected] = useState<FilmMovement | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);

  const [loading, setLoading] = useState(false);

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

  const handleSelectMovement = async (movement: FilmMovement) => {
    setSelected(movement);
    setLoading(true);

    try {
      const data = await discoverMedia({
        country: movement.country,
        genreId: movement.genreId,
        minRating: '6.5',
        page: 1,
      });

      setMovies(data.results.slice(0, 18));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>World Cinema Eras &amp; Movements</h1>
        <p className={styles.subtitle}>
          The defining artistic movements, aesthetic revolutions, and visionary schools that transformed the language of motion pictures.
        </p>
      </header>

      <section className={styles.movementsGrid} aria-label="Cinema Movements">
        {FILM_MOVEMENTS.map((movement) => {
          const isSelected = selected?.id === movement.id;

          return (
            <button
              key={movement.id}
              type="button"
              className={`${styles.movementCard} ${isSelected ? styles.active : ''}`}
              onClick={() => handleSelectMovement(movement)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.eraTag}>{movement.era}</span>
              </div>

              <h2 className={styles.cardTitle}>{movement.name}</h2>

              <p className={styles.cardDesc}>{movement.description}</p>
            </button>
          );
        })}
      </section>

      {selected && (
        <section className={styles.activeSection}>
          <div className={styles.activeHeader}>
            <h2 className={styles.activeTitle}>
              <Layers size={18} style={{ color: 'var(--color-accent-gold)', marginRight: '8px' }} />
              {selected.name} Canon &amp; Selections
            </h2>
          </div>

          <MovieGrid
            movies={movies}
            isLoading={loading}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        </section>
      )}
    </div>
  );
};
