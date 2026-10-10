import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitRating, fetchMovieRating } from '../../api/backend';
import type { RatingData } from '../../api/backend';
import { Star, X } from 'lucide-react';

interface RatingModalProps {
  tmdbId: number;
  mediaType?: string;
  movieTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { key: 'overall', label: 'Overall', icon: '⭐' },
  { key: 'cinematography', label: 'Cinematography', icon: '🎥' },
  { key: 'acting', label: 'Acting', icon: '🎭' },
  { key: 'story', label: 'Story', icon: '📖' },
  { key: 'soundtrack', label: 'Soundtrack', icon: '🎵' },
] as const;

export const RatingModal: React.FC<RatingModalProps> = ({ tmdbId, mediaType = 'movie', movieTitle, isOpen, onClose }) => {
  const { isLoggedIn } = useAuth();
  const [ratings, setRatings] = useState<Record<string, number>>({
    overall: 0, cinematography: 0, acting: 0, story: 0, soundtrack: 0,
  });
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingLoaded, setExistingLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && isLoggedIn && !existingLoaded) {
      fetchMovieRating(tmdbId, mediaType).then((data: any) => {
        if (data && data.overall) {
          setRatings({
            overall: data.overall || 0,
            cinematography: data.cinematography || 0,
            acting: data.acting || 0,
            story: data.story || 0,
            soundtrack: data.soundtrack || 0,
          });
          setReviewText(data.reviewText || '');
        }
        setExistingLoaded(true);
      }).catch(() => setExistingLoaded(true));
    }
  }, [isOpen, isLoggedIn, tmdbId, mediaType, existingLoaded]);

  const handleSetRating = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (ratings.overall === 0) return;
    setLoading(true);
    try {
      const ratingData: RatingData = {
        tmdbId,
        mediaType,
        overall: ratings.overall,
        cinematography: ratings.cinematography || undefined,
        acting: ratings.acting || undefined,
        story: ratings.story || undefined,
        soundtrack: ratings.soundtrack || undefined,
        reviewText: reviewText.trim() || undefined,
      };
      await submitRating(ratingData);
      setSaved(true);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-10)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-12)',
          maxWidth: '480px', width: '100%',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-10)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
            Rate: {movieTitle}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {!isLoggedIn ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
            <p style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>Sign in to rate movies</p>
            <a href="/login" style={{ color: 'var(--color-text-inverse)', fontWeight: 600 }}>Sign In →</a>
          </div>
        ) : (
          <>
            {CATEGORIES.map(({ key, label, icon }) => (
              <div key={key} style={{ marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                    {icon} {label} {key === 'overall' && <span style={{ color: 'var(--color-state-error)' }}>*</span>}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-inverse)', fontWeight: 600 }}>
                    {ratings[key] || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                    <button
                      key={v}
                      onClick={() => handleSetRating(key, v)}
                      style={{
                        flex: 1, height: '28px',
                        backgroundColor: v <= ratings[key] ? 'var(--color-text-inverse)' : 'var(--color-surface-muted)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'all 100ms ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 'var(--space-10)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                📝 Review (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                placeholder="Share your thoughts…"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-surface-muted)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-6) var(--space-8)',
                  color: 'var(--color-text-secondary)',
                  resize: 'vertical',
                  fontSize: 'var(--font-size-sm)',
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || ratings.overall === 0}
              style={{
                width: '100%',
                backgroundColor: saved ? 'var(--color-state-success)' : 'var(--color-text-inverse)',
                color: 'var(--color-surface-base)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '12px', fontWeight: 600,
                cursor: loading || ratings.overall === 0 ? 'not-allowed' : 'pointer',
                opacity: ratings.overall === 0 ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {saved ? (
                <><Star size={16} /> Rating Saved!</>
              ) : loading ? 'Saving…' : (
                <><Star size={16} /> Submit Rating</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
