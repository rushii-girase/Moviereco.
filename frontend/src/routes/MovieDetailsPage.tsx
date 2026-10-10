import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, fetchCollectionDetails } from '../api/tmdb';
import type { MovieDetails, CollectionPart } from '../api/tmdb';
import { PersonModal } from '../components/PersonModal/PersonModal';
import { Star, Clock, Calendar, Bookmark, ArrowLeft, Play, Tv, Layers } from 'lucide-react';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [collectionParts, setCollectionParts] = useState<CollectionPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem('wishlist');
    const wishlistIds: number[] = saved ? JSON.parse(saved) : [];
    setIsInWishlist(wishlistIds.includes(parseInt(id)));

    fetchMovieDetails(id, 'movie')
      .then(async (data) => {
        setMovie(data);
        if (data.belongs_to_collection?.id) {
          fetchCollectionDetails(data.belongs_to_collection.id).then(setCollectionParts).catch(console.error);
        }
      })
      .catch(() => {
        fetchMovieDetails(id, 'tv').then(setMovie).catch(console.error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleWishlist = () => {
    if (!movie) return;
    const saved = localStorage.getItem('wishlist');
    const prev: number[] = saved ? JSON.parse(saved) : [];
    const updated = prev.includes(movie.id)
      ? prev.filter((item) => item !== movie.id)
      : [...prev, movie.id];
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setIsInWishlist(updated.includes(movie.id));
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 'var(--layout-max-width)', margin: '48px auto', padding: '0 24px' }}>
        <p style={{ color: 'var(--color-text-primary)' }}>Loading details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ maxWidth: 'var(--layout-max-width)', margin: '48px auto', padding: '0 24px' }}>
        <p style={{ color: 'var(--color-text-primary)' }}>Details not found.</p>
      </div>
    );
  }

  const trailer = movie.videos?.results.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  const director = movie.credits?.crew.find((c) => c.job === 'Director');
  const cinematographer = movie.credits?.crew.find(
    (c) => c.job === 'Director of Photography' || c.job === 'Cinematographer' || c.department === 'Camera'
  );
  const writers = movie.credits?.crew.filter((c) => c.job === 'Writer' || c.job === 'Screenplay' || c.job === 'Story').slice(0, 3) || [];
  const producers = movie.credits?.crew.filter((c) => c.job === 'Producer' || c.job === 'Executive Producer').slice(0, 3) || [];

  const watchProviders = movie['watch/providers']?.results?.US?.flatrate || movie['watch/providers']?.results?.IN?.flatrate || [];

  const cast = movie.credits?.cast.slice(0, 12) || [];

  return (
    <div style={{ maxWidth: 'var(--layout-max-width)', margin: '0 auto', padding: 'var(--space-10)' }}>
      <Link to="/discover" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Discover
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(250px, 320px) 1fr',
          gap: 'var(--space-12)',
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-12)',
          marginBottom: 'var(--space-12)',
        }}
      >
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '2 / 3' }}>
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster of ${movie.title || movie.name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-tertiary)' }}>
              No Poster
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)' }}>
            {movie.title || movie.name}
          </h1>

          {movie.tagline && (
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-inverse)', fontSize: 'var(--font-size-base)' }}>
              "{movie.tagline}"
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', color: 'var(--color-text-primary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-inverse)', fontWeight: 600 }}>
              <Star size={16} fill="currentColor" /> {movie.vote_average.toFixed(1)} / 10
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={16} /> {movie.release_date || movie.first_air_date || 'N/A'}
            </span>
            {movie.runtime && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={16} /> {movie.runtime} min
              </span>
            )}
            {movie.number_of_seasons && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-inverse)' }}>
                <Tv size={16} /> {movie.number_of_seasons} Seasons ({movie.number_of_episodes} Episodes)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {movie.genres.map((g) => (
              <span
                key={g.id}
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '4px 10px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {g.name}
              </span>
            ))}
          </div>

          <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
            {movie.overview}
          </p>

          {watchProviders.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '6px' }}>
                Where to Watch / Stream On:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {watchProviders.map((provider) => (
                  <div key={provider.provider_id} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-surface-muted)', padding: '4px 8px', borderRadius: 'var(--radius-xs)' }}>
                    <img src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt={provider.provider_name} style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{provider.provider_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {trailer && (
              <button
                onClick={() => setShowTrailerModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ff0000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Play size={18} fill="currentColor" /> Watch Trailer
              </button>
            )}

            <button
              onClick={toggleWishlist}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isInWishlist ? 'var(--color-text-inverse)' : 'var(--color-surface-muted)',
                color: isInWishlist ? 'var(--color-surface-base)' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 24px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Bookmark size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
              {isInWishlist ? 'In Your Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {collectionParts.length > 0 && (
        <section style={{ marginBottom: 'var(--space-13)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--color-text-inverse)" /> Franchise Parts & Movie Collection
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
            {collectionParts.map((part) => (
              <Link key={part.id} to={`/movie/${part.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ width: '100%', aspectRatio: '2 / 3', backgroundColor: 'var(--color-surface-muted)' }}>
                    {part.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w185${part.poster_path}`} alt={part.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '11px' }}>No Poster</div>
                    )}
                  </div>
                  <div style={{ padding: '8px' }}>
                    <p style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>{part.title}</p>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{part.release_date ? part.release_date.substring(0, 4) : ''}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {movie.seasons && movie.seasons.length > 0 && (
        <section style={{ marginBottom: 'var(--space-13)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tv size={20} color="var(--color-text-inverse)" /> Seasons & Episodes ({movie.number_of_seasons})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {movie.seasons.map((season) => (
              <div key={season.id} style={{ backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ width: '100%', aspectRatio: '2 / 3', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '8px', backgroundColor: 'var(--color-surface-muted)' }}>
                  {season.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w185${season.poster_path}`} alt={season.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '11px' }}>No Poster</div>
                  )}
                </div>
                <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>{season.name}</h4>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-inverse)', margin: 0 }}>{season.episode_count} Episodes</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginBottom: 'var(--space-13)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          Main Crew & Filmmakers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {director && (
            <div
              onClick={() => setSelectedPersonId(director.id)}
              style={{ backgroundColor: 'var(--color-surface-raised)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Director</span>
              <p style={{ fontWeight: 600, color: 'var(--color-text-inverse)' }}>{director.name} ↗</p>
            </div>
          )}
          {cinematographer && (
            <div
              onClick={() => setSelectedPersonId(cinematographer.id)}
              style={{ backgroundColor: 'var(--color-surface-raised)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Cinematographer / Cameraman</span>
              <p style={{ fontWeight: 600, color: 'var(--color-text-inverse)' }}>{cinematographer.name} ↗</p>
            </div>
          )}
          {writers.length > 0 && (
            <div style={{ backgroundColor: 'var(--color-surface-raised)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Writers</span>
              <p style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{writers.map((w) => w.name).join(', ')}</p>
            </div>
          )}
          {producers.length > 0 && (
            <div style={{ backgroundColor: 'var(--color-surface-raised)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Producers</span>
              <p style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{producers.map((p) => p.name).join(', ')}</p>
            </div>
          )}
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-13)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)' }}>
          Cast & Actors (Click to view Profile & Timeline)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
          {cast.map((actor) => (
            <div
              key={actor.id}
              onClick={() => setSelectedPersonId(actor.id)}
              style={{
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '1 / 1', backgroundColor: 'var(--color-surface-muted)' }}>
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                    No Photo
                  </div>
                )}
              </div>
              <div style={{ padding: '8px 4px' }}>
                <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-inverse)', margin: 0 }}>
                  {actor.name} ↗
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', margin: '2px 0 0 0' }}>
                  {actor.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PersonModal personId={selectedPersonId} onClose={() => setSelectedPersonId(null)} />

      {showTrailerModal && trailer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setShowTrailerModal(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              aspectRatio: '16 / 9',
              backgroundColor: '#000000',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailerModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Official Trailer"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
