import React, { useEffect, useState } from 'react';
import { fetchPersonDetails } from '../../api/tmdb';
import type { PersonDetails } from '../../api/tmdb';
import { X, Calendar, MapPin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PersonModalProps {
  personId: number | null;
  onClose: () => void;
}

export const PersonModal: React.FC<PersonModalProps> = ({ personId, onClose }) => {
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personId) return;
    setLoading(true);
    fetchPersonDetails(personId)
      .then(setPerson)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [personId]);

  if (!personId) return null;

  const credits = person?.combined_credits?.cast || [];
  const sortedCredits = [...credits]
    .filter((c) => c.release_date || c.first_air_date)
    .sort((a, b) => {
      const yearA = (a.release_date || a.first_air_date || '0').substring(0, 4);
      const yearB = (b.release_date || b.first_air_date || '0').substring(0, 4);
      return parseInt(yearB) - parseInt(yearA);
    });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '850px',
          maxHeight: '90vh',
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflowY: 'auto',
          padding: '24px',
          color: 'var(--color-text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'var(--color-surface-muted)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '48px 0' }}>Loading profile & filmography timeline...</p>
        ) : person ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '1 / 1', backgroundColor: 'var(--color-surface-muted)' }}>
                {person.profile_path ? (
                  <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '12px' }}>No Photo</div>
                )}
              </div>

              <div>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
                  {person.name}
                </h2>
                <span style={{ color: 'var(--color-text-inverse)', fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: '8px' }}>
                  {person.known_for_department}
                </span>

                <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
                  {person.birthday && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> Born: {person.birthday}
                    </span>
                  )}
                  {person.place_of_birth && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {person.place_of_birth}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.5, maxHeight: '100px', overflowY: 'auto' }}>
                  {person.biography || 'No biography available.'}
                </p>
              </div>
            </div>

            <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="var(--color-text-inverse)" /> Filmography Timeline
            </h3>

            <div style={{ borderLeft: '2px solid var(--color-border-subtle)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedCredits.slice(0, 25).map((item) => {
                const year = (item.release_date || item.first_air_date || 'N/A').substring(0, 4);
                return (
                  <div key={`${item.id}-${item.character}`} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-23px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-text-inverse)' }} />
                    <span style={{ fontWeight: 700, color: 'var(--color-text-inverse)', fontSize: 'var(--font-size-xs)' }}>
                      {year}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                      <Link to={`/movie/${item.id}`} onClick={onClose} style={{ color: 'var(--color-text-secondary)', fontWeight: 600, textDecoration: 'none' }}>
                        {item.title || item.name}
                      </Link>
                      {item.character && (
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                          as {item.character}
                        </span>
                      )}
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', marginLeft: 'auto' }}>
                        ⭐ {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
