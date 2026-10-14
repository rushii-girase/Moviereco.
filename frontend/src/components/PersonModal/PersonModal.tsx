import React, { useEffect, useState } from 'react';
import { fetchPersonDetails } from '../../api/tmdb';
import type { PersonDetails } from '../../api/tmdb';
import { X, Calendar, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PersonModalProps {
  personId: number | null;
  onClose: () => void;
}

export const PersonModal: React.FC<PersonModalProps> = ({ personId, onClose }) => {
  const [person, setPerson] = useState<PersonDetails | null>(null);

  useEffect(() => {
    if (!personId) {
      return;
    }

    let isMounted = true;

    fetchPersonDetails(personId)
      .then((data) => {
        if (isMounted) {
          setPerson(data);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [personId]);

  if (!personId) {
    return null;
  }

  const isLoading = person === null || person.id !== personId;

  const credits = person?.combined_credits?.cast || [];

  const sortedCredits = [...credits]
    .filter((c) => c.release_date || c.first_air_date)
    .sort((a, b) => {
      const yearA = (a.release_date || a.first_air_date || '0').substring(0, 4);
      const yearB = (b.release_date || b.first_air_date || '0').substring(0, 4);

      return parseInt(yearB, 10) - parseInt(yearA, 10);
    });

  const photoUrl = person?.profile_path
    ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        backgroundColor: 'rgba(8, 9, 11, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          backgroundColor: 'var(--color-surface-card)',
          border: '1px solid var(--color-border-hover)',
          borderRadius: 'var(--radius-xl)',
          overflowY: 'auto',
          padding: 'var(--space-10)',
          boxShadow: 'var(--shadow-elevation)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-tertiary)',
            cursor: 'pointer',
          }}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-primary)' }}>
            Loading filmography...
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', marginBottom: 'var(--space-9)' }}>
              <div
                style={{
                  width: '140px',
                  aspectRatio: '1 / 1.3',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface-muted)',
                  flexShrink: 0,
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={person.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-tertiary)' }}>
                    <User size={32} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, minWidth: '240px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-accent-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {person.known_for_department}
                </span>

                <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', color: '#fff' }}>
                  {person.name}
                </h2>

                <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', flexWrap: 'wrap' }}>
                  {person.birthday && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> Born: {person.birthday}
                    </span>
                  )}
                  {person.place_of_birth && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {person.place_of_birth}
                    </span>
                  )}
                </div>

                {person.biography && (
                  <p
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      lineHeight: 1.6,
                      color: 'var(--color-text-primary)',
                      marginTop: '6px',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {person.biography}
                  </p>
                )}
              </div>
            </div>

            <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
              Significant Works &amp; Filmography
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'var(--space-6)' }}>
              {sortedCredits.slice(0, 18).map((credit) => {
                const poster = credit.poster_path
                  ? `https://image.tmdb.org/t/p/w185${credit.poster_path}`
                  : null;

                const year = (credit.release_date || credit.first_air_date || '').slice(0, 4);

                return (
                  <Link
                    key={`${credit.id}-${credit.character}`}
                    to={`/movie/${credit.id}`}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '2 / 3',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        backgroundColor: 'var(--color-surface-muted)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      {poster ? (
                        <img
                          src={poster}
                          alt={credit.title || credit.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--color-text-tertiary)' }}>
                          No Poster
                        </div>
                      )}
                    </div>

                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {credit.title || credit.name}
                    </span>

                    <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                      {year}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
