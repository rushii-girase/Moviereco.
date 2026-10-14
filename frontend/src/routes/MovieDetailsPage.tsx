import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, fetchCollectionDetails } from '../api/tmdb';
import type { MovieDetails, CollectionPart } from '../api/tmdb';
import { PersonModal } from '../components/PersonModal/PersonModal';
import { RatingModal } from '../components/RatingModal/RatingModal';
import { Star, Clock, Calendar, Bookmark, Play, X, User } from 'lucide-react';
import styles from './MovieDetailsPage.module.css';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<MovieDetails | null>(null);

  const [collectionParts, setCollectionParts] = useState<CollectionPart[]>([]);

  const [loading, setLoading] = useState(true);

  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const [showRatingModal, setShowRatingModal] = useState(false);

  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const [isInWishlist, setIsInWishlist] = useState<boolean>(() => {
    if (!id) {
      return false;
    }

    const saved = localStorage.getItem('wishlist');

    if (!saved) {
      return false;
    }

    try {
      const wishlistIds: number[] = JSON.parse(saved);

      return wishlistIds.includes(parseInt(id, 10));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true;

    fetchMovieDetails(id, 'movie')
      .then(async (data) => {
        if (!isMounted) {
          return;
        }

        setMovie(data);

        if (data.belongs_to_collection?.id) {
          fetchCollectionDetails(data.belongs_to_collection.id)
            .then((parts) => {
              if (isMounted) {
                setCollectionParts(parts);
              }
            })
            .catch(console.error);
        }
      })
      .catch(() => {
        fetchMovieDetails(id, 'tv')
          .then((tvData) => {
            if (isMounted) {
              setMovie(tvData);
            }
          })
          .catch(console.error);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleWishlist = () => {
    if (!movie) {
      return;
    }

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
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-primary)', padding: '64px 0' }}>Loading film details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-primary)', padding: '64px 0' }}>Details not found.</p>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const trailer = movie.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
  );

  const releaseYear = (movie.release_date || movie.first_air_date || '').slice(0, 4);

  const director = movie.credits?.crew?.find(
    (c) => c.job === 'Director',
  );

  const writers = movie.credits?.crew?.filter(
    (c) => c.job === 'Screenplay' || c.job === 'Writer',
  ) || [];

  const streamProviders = movie['watch/providers']?.results?.US?.flatrate || [];

  const buyRentProviders = [
    ...(movie['watch/providers']?.results?.US?.rent || []),
    ...(movie['watch/providers']?.results?.US?.buy || []),
  ];

  return (
    <article className={styles.page}>
      {/* Hero Backdrop Stage */}
      <div className={styles.backdropStage}>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title || movie.name}
            className={styles.backdropImg}
          />
        )}
        <div className={styles.backdropGradient} />
      </div>

      <div className={styles.contentContainer}>
        {/* Left Column: Poster & Actions */}
        <aside className={styles.leftCol}>
          <div className={styles.posterCard}>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`Poster of ${movie.title || movie.name}`}
                className={styles.posterImg}
              />
            ) : (
              <div className={styles.posterPlaceholder}>No Poster</div>
            )}
          </div>

          <div className={styles.actionStack}>
            {trailer && (
              <button
                type="button"
                className={styles.primaryActionBtn}
                onClick={() => setShowTrailerModal(true)}
              >
                <Play size={16} fill="currentColor" />
                <span>Play Trailer</span>
              </button>
            )}

            <button
              type="button"
              className={`${styles.secondaryActionBtn} ${isInWishlist ? styles.active : ''}`}
              onClick={toggleWishlist}
            >
              <Bookmark size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
              <span>{isInWishlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button
              type="button"
              className={styles.secondaryActionBtn}
              onClick={() => setShowRatingModal(true)}
            >
              <Star size={16} />
              <span>Rate &amp; Review</span>
            </button>
          </div>

          {/* Where to Watch */}
          {(streamProviders.length > 0 || buyRentProviders.length > 0) && (
            <div className={styles.providersBox}>
              <span className={styles.providersTitle}>Where to Stream</span>

              {streamProviders.length > 0 && (
                <div className={styles.providersList}>
                  {streamProviders.slice(0, 4).map((p) => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                      className={styles.providerLogo}
                    />
                  ))}
                </div>
              )}

              {buyRentProviders.length > 0 && (
                <>
                  <span className={styles.providersTitle} style={{ marginTop: '8px' }}>
                    Rent or Purchase
                  </span>
                  <div className={styles.providersList}>
                    {buyRentProviders.slice(0, 4).map((p) => (
                      <img
                        key={p.provider_id}
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                        alt={p.provider_name}
                        title={p.provider_name}
                        className={styles.providerLogo}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </aside>

        {/* Right Column: Title, Plot, Credits & Cast */}
        <section className={styles.rightCol}>
          <div className={styles.titleArea}>
            <div className={styles.metaRow}>
              {movie.vote_average && movie.vote_average > 0 ? (
                <span className={styles.scorePill}>
                  <Star size={13} fill="currentColor" />
                  <span>{movie.vote_average.toFixed(1)} TMDB</span>
                </span>
              ) : null}

              {releaseYear && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  <span>{releaseYear}</span>
                </span>
              )}

              {movie.runtime ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  <span>{movie.runtime} min</span>
                </span>
              ) : null}
            </div>

            <h1 className={styles.mainTitle}>{movie.title || movie.name}</h1>

            {movie.tagline && (
              <p className={styles.tagline}>&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.genrePills}>
                {movie.genres.map((g) => (
                  <span key={g.id} className={styles.genreBadge}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className={styles.synopsis}>{movie.overview}</p>

          {/* Key Filmmakers */}
          {(director || writers.length > 0) && (
            <div className={styles.crewGrid}>
              {director && (
                <div className={styles.crewItem}>
                  <span className={styles.crewRole}>Director</span>
                  <span className={styles.crewName}>{director.name}</span>
                </div>
              )}

              {writers.length > 0 && (
                <div className={styles.crewItem}>
                  <span className={styles.crewRole}>Screenplay &amp; Writing</span>
                  <span className={styles.crewName}>
                    {writers.slice(0, 2).map((w) => w.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Cast Carousel */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className={styles.castSection}>
              <h2 className={styles.sectionHeading}>Principal Cast</h2>

              <div className={styles.castRack}>
                {movie.credits.cast.slice(0, 10).map((actor) => {
                  const photo = actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : null;

                  return (
                    <button
                      key={actor.id}
                      type="button"
                      className={styles.castCard}
                      onClick={() => setSelectedPersonId(actor.id)}
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt={actor.name}
                          className={styles.castPhoto}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.castPlaceholder}>
                          <User size={24} />
                        </div>
                      )}

                      <div className={styles.castDetails}>
                        <span className={styles.castName}>{actor.name}</span>
                        <span className={styles.castCharacter}>{actor.character}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Collection Explorer */}
          {collectionParts.length > 0 && (
            <div className={styles.collectionSection}>
              <h2 className={styles.sectionHeading}>Franchise &amp; Connected Films</h2>

              <div className={styles.castRack}>
                {collectionParts.map((part) => (
                  <Link
                    key={part.id}
                    to={`/movie/${part.id}`}
                    className={styles.castCard}
                    style={{ width: '130px' }}
                  >
                    {part.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${part.poster_path}`}
                        alt={part.title}
                        className={styles.castPhoto}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.castPlaceholder}>No Poster</div>
                    )}

                    <div className={styles.castDetails}>
                      <span className={styles.castName}>{part.title}</span>
                      <span className={styles.castCharacter}>
                        {(part.release_date || '').slice(0, 4)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && trailer && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
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
              backgroundColor: '#000',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowTrailerModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close trailer"
            >
              <X size={20} />
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={`${movie.title || movie.name} Trailer`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Person Filmography Modal */}
      {selectedPersonId && (
        <PersonModal
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
        />
      )}

      {/* Rating & Review Modal */}
      {showRatingModal && (
        <RatingModal
          movieId={movie.id}
          movieTitle={movie.title || movie.name || ''}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </article>
  );
};
