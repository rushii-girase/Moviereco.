import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Film } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [localError, setLocalError] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login, register, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          setLocalError('Unable to connect to backend server. Make sure Spring Boot is running on port 8080.');
        } else {
          setLocalError(err.message);
        }
      } else {
        setLocalError('Authentication request failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div style={{ maxWidth: '400px', margin: '48px auto', padding: '0 var(--space-6)' }}>
      <div
        style={{
          backgroundColor: 'var(--color-surface-card)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-10) var(--space-8)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-5)' }}>
          <Film size={26} style={{ color: 'var(--color-accent-gold)' }} />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-family-display)',
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
            textAlign: 'center',
            letterSpacing: '0.01em',
          }}
        >
          {isRegister ? 'Create account' : 'Sign in'}
        </h1>

        <p
          style={{
            textAlign: 'center',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {isRegister
            ? 'Save personal watchlists, ratings, and curated lists'
            : 'Access your watchlist and ratings'}
        </p>

        {displayError && (
          <div
            style={{
              backgroundColor: 'rgba(248, 113, 113, 0.12)',
              border: '1px solid rgba(248, 113, 113, 0.35)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              color: 'var(--color-state-error)',
              fontSize: 'var(--font-size-xs)',
              marginBottom: 'var(--space-6)',
              lineHeight: 1.5,
            }}
          >
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {isRegister && (
            <div>
              <label
                htmlFor="name"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                  fontWeight: 600,
                }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="François Truffaut"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: 'var(--color-surface-muted)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
                fontWeight: 600,
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cinephile@cinema.org"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
                fontWeight: 600,
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
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
            type="submit"
            disabled={loading}
            style={{
              marginTop: 'var(--space-4)',
              padding: '10px var(--space-6)',
              backgroundColor: 'var(--color-accent-gold)',
              color: '#090a0d',
              fontWeight: 600,
              fontSize: 'var(--font-size-sm)',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color var(--motion-duration-instant) ease',
            }}
          >
            {loading ? 'Processing...' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setLocalError('');
              clearError();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-xs)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isRegister
              ? 'Already possess an account? Sign In'
              : 'New to MovieReco? Create an Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
