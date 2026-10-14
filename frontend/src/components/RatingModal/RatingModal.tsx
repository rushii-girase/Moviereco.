import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { submitRating, fetchMovieRating } from '../../api/backend';
import type { RatingData } from '../../api/backend';
import { Star, X } from 'lucide-react';

interface RatingModalProps {
  movieId?: number;
  tmdbId?: number;
  mediaType?: string;
  movieTitle: string;
  isOpen?: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { key: 'overall', label: 'Overall Impression', icon: '⭐' },
  { key: 'cinematography', label: 'Cinematography & Light', icon: '🎥' },
  { key: 'acting', label: 'Performances & Acting', icon: '🎭' },
  { key: 'story', label: 'Screenplay & Narrative', icon: '📖' },
  { key: 'soundtrack', label: 'Soundtrack & Sound Design', icon: '🎵' },
] as const;

export const RatingModal: React.FC<RatingModalProps> = ({
  movieId,
  tmdbId,
  mediaType = 'movie',
  movieTitle,
  onClose,
}) => {
  const targetId = tmdbId || movieId || 0;

  const { isLoggedIn } = useAuth();

  const [ratings, setRatings] = useState<Record<string, number>>({
    overall: 0,
    cinematography: 0,
    acting: 0,
    story: 0,
    soundtrack: 0,
  });

  const [reviewText, setReviewText] = useState('');

  const [loading, setLoading] = useState(false);

  const [saved, setSaved] = useState(false);

  const [existingLoaded, setExistingLoaded] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !existingLoaded && targetId > 0) {
      fetchMovieRating(targetId, mediaType)
        .then((r: RatingData | null) => {
          if (r && r.overall) {
            setRatings({
              overall: r.overall || 0,
              cinematography: r.cinematography || 0,
              acting: r.acting || 0,
              story: r.story || 0,
              soundtrack: r.soundtrack || 0,
            });

            setReviewText(r.reviewText || '');
          }

          setExistingLoaded(true);
        })
        .catch(() => {
          setExistingLoaded(true);
        });
    }
  }, [isLoggedIn, targetId, mediaType, existingLoaded]);

  const handleSetRating = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (ratings.overall === 0) {
      return;
    }

    setLoading(true);

    try {
      const ratingData: RatingData = {
        tmdbId: targetId,
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
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 350,
        backgroundColor: 'rgba(8, 9, 11, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface-card)',
          border: '1px solid var(--color-border-hover)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-10) var(--space-8)',
          maxWidth: '520px',
          width: '100%',
          boxShadow: 'var(--shadow-elevation)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-tertiary)',
            cursor: 'pointer',
          }}
          aria-label="Close review dialog"
        >
          <X size={20} />
        </button>

        <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
          Rate &amp; Review
        </h2>

        <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-8)' }}>
          {movieTitle}
        </p>

        {!isLoggedIn ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', marginBottom: '16px' }}>
              Sign in to record your multi-dimensional film score and review.
            </p>
            <a
              href="/login"
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-accent-gold)',
                color: '#08090b',
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: 'var(--font-size-xs)',
              }}
            >
              Sign In to Rate
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {CATEGORIES.map(({ key, label, icon }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </span>

                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        color: star <= (ratings[key] || 0) ? 'var(--color-accent-gold)' : 'var(--color-text-tertiary)',
                        transition: 'transform 0.1s ease',
                      }}
                      onClick={() => handleSetRating(key, star)}
                      aria-label={`${star} stars for ${label}`}
                    >
                      <Star size={18} fill={star <= (ratings[key] || 0) ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 'var(--space-4)' }}>
              <label
                htmlFor="reviewNotes"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                  fontWeight: 600,
                }}
              >
                Cinephile Notes &amp; Thoughts
              </label>

              <textarea
                id="reviewNotes"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your critical impressions, memorable scenes, auteur techniques..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-surface-muted)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="button"
              disabled={loading || ratings.overall === 0}
              onClick={handleSubmit}
              style={{
                marginTop: 'var(--space-4)',
                padding: '12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: saved ? 'var(--color-state-success)' : 'var(--color-accent-gold)',
                color: '#08090b',
                fontWeight: 700,
                fontSize: 'var(--font-size-sm)',
                border: 'none',
                cursor: loading || ratings.overall === 0 ? 'not-allowed' : 'pointer',
                opacity: ratings.overall === 0 ? 0.4 : 1,
                transition: 'all var(--motion-duration-instant) ease',
              }}
            >
              {saved ? 'Rating Saved!' : loading ? 'Submitting...' : 'Save Rating & Review'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
