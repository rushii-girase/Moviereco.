import React, { useState } from 'react';
import { discoverMedia } from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid/MovieGrid';
import type { Movie } from '../components/MovieCard/MovieCard';
import { Film, Globe, Palette } from 'lucide-react';

interface FilmMovement {
  id: string;
  name: string;
  era: string;
  description: string;
  genreId?: string;
  country?: string;
  yearStart: string;
  yearEnd: string;
  keywords?: string;
}

const FILM_MOVEMENTS: FilmMovement[] = [
  { id: 'french-new-wave', name: 'French New Wave', era: '1958–1973', description: 'Radical visual experimentation by Godard, Truffaut, Varda. Handheld cameras, jump cuts, location shooting.', country: 'FR', yearStart: '1958', yearEnd: '1973' },
  { id: 'italian-neorealism', name: 'Italian Neorealism', era: '1943–1955', description: 'Post-war Italy captured by De Sica, Rossellini. Non-professional actors, real locations, social themes.', country: 'IT', yearStart: '1943', yearEnd: '1955' },
  { id: 'german-expressionism', name: 'German Expressionism', era: '1920–1930', description: 'Distorted sets, dramatic lighting, psychological depth. The Cabinet of Dr. Caligari, Metropolis, Nosferatu.', country: 'DE', yearStart: '1920', yearEnd: '1930' },
  { id: 'korean-golden-age', name: 'Korean Golden Age', era: '2000–Present', description: 'Park Chan-wook, Bong Joon-ho, Kim Ki-duk. Genre-bending masterworks winning global acclaim.', country: 'KR', yearStart: '2000', yearEnd: '2026' },
  { id: 'japanese-golden-age', name: 'Japanese Golden Age', era: '1950–1970', description: 'Kurosawa, Ozu, Mizoguchi. Seven Samurai, Tokyo Story, Rashomon changed cinema forever.', country: 'JP', yearStart: '1950', yearEnd: '1970' },
  { id: 'hollywood-new-wave', name: 'New Hollywood', era: '1967–1980', description: 'Scorsese, Coppola, Spielberg, Kubrick broke the studio mold. Gritty, personal, director-driven.', country: 'US', yearStart: '1967', yearEnd: '1980' },
  { id: 'bollywood-parallel', name: 'Indian Parallel Cinema', era: '1950–1990', description: 'Satyajit Ray, Ritwik Ghatak, Shyam Benegal. Artistic counterpoint to commercial Bollywood.', country: 'IN', yearStart: '1950', yearEnd: '1990' },
  { id: 'soviet-montage', name: 'Soviet Montage', era: '1920–1933', description: 'Eisenstein, Vertov, Pudovkin pioneered editing as art. Battleship Potemkin, Man with a Movie Camera.', country: 'RU', yearStart: '1920', yearEnd: '1933' },
  { id: 'hong-kong-action', name: 'Hong Kong Action Cinema', era: '1970–2000', description: 'John Woo, Wong Kar-wai, Tsui Hark. Martial arts ballet meets poetic visuals.', country: 'HK', yearStart: '1970', yearEnd: '2000', genreId: '28' },
  { id: 'nordic-noir', name: 'Nordic Noir', era: '2005–Present', description: 'Scandinavian crime thrillers. Dark, atmospheric, socially conscious. The Girl with the Dragon Tattoo era.', country: 'SE', yearStart: '2005', yearEnd: '2026', genreId: '80' },
  { id: 'brazilian-cinema-novo', name: 'Brazilian Cinema Novo', era: '1960–1972', description: 'Glauber Rocha led a revolutionary film movement using allegory and surrealism to critique politics.', country: 'BR', yearStart: '1960', yearEnd: '1972' },
  { id: 'iranian-new-wave', name: 'Iranian New Wave', era: '1960–Present', description: 'Kiarostami, Farhadi, Panahi. Poetic minimalism and social realism under political constraints.', country: 'IR', yearStart: '1960', yearEnd: '2026' },
];

export const FilmMovementsPage: React.FC = () => {
  const [selected, setSelected] = useState<FilmMovement | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    const s = localStorage.getItem('wishlist');
    return s ? JSON.parse(s) : [];
  });

  const handleSelectMovement = async (movement: FilmMovement) => {
    setSelected(movement);
    setLoading(true);
    try {
      const data = await discoverMedia({
        country: movement.country,
        genreId: movement.genreId,
        year: undefined,
        minRating: '6',
        page: 1,
      });
      setMovies(data.results.slice(0, 20));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = (movieId: number, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlistIds((prev) => {
      const updated = prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-13)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-6)' }}>
          <Palette size={28} color="var(--color-text-inverse)" /> Film Movements & Eras
        </h1>
        <p style={{ color: 'var(--color-text-primary)', maxWidth: '700px' }}>
          Explore the cinema movements that shaped filmmaking. Each era represents a revolution in storytelling, visual style, and cultural expression.
        </p>
      </div>

      {/* Movements Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'var(--space-10)',
        marginBottom: 'var(--space-13)',
      }}>
        {FILM_MOVEMENTS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelectMovement(m)}
            style={{
              backgroundColor: selected?.id === m.id ? 'var(--color-surface-raised)' : 'var(--color-surface-muted)',
              border: selected?.id === m.id ? '1px solid var(--color-text-inverse)' : '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-10)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all var(--motion-duration-instant) ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Globe size={16} color="var(--color-text-inverse)" />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-inverse)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {m.era}
              </span>
            </div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {m.name}
            </h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', lineHeight: '1.4' }}>
              {m.description}
            </p>
          </button>
        ))}
      </div>

      {/* Selected Movement Films */}
      {selected && (
        <section>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={20} color="var(--color-text-inverse)" /> Notable Films — {selected.name}
          </h2>
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
