import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setLocalError('Unable to connect to backend server. Make sure Spring Boot backend is running on http://localhost:8080');
      } else {
        setLocalError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div style={{ maxWidth: '420px', margin: '64px auto', padding: 'var(--space-10)' }}>
      <div
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-12)',
        }}
      >
        <h1 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          {isRegister ? 'Create Account' : 'Sign In'}
        </h1>
        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-10)' }}>
          {isRegister ? 'Join MovieReco to save your watchlist and ratings' : 'Welcome back, cinephile'}
        </p>

        {displayError && (
          <div style={{
            backgroundColor: 'rgba(255,107,107,0.1)',
            border: '1px solid var(--color-state-error)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-6) var(--space-8)',
            marginBottom: 'var(--space-8)',
            color: 'var(--color-state-error)',
            fontSize: 'var(--font-size-sm)',
          }}>
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--font-size-sm)' }}>Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-surface-muted)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-6) var(--space-8)',
                  color: 'var(--color-text-secondary)',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--font-size-sm)' }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-6) var(--space-8)',
                color: 'var(--color-text-secondary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--font-size-sm)' }}>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-surface-muted)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-6) var(--space-8)',
                color: 'var(--color-text-secondary)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'var(--color-text-inverse)',
              color: 'var(--color-surface-base)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading…' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-10)', fontSize: 'var(--font-size-sm)' }}>
          <span style={{ color: 'var(--color-text-tertiary)' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            onClick={() => { setIsRegister(!isRegister); setLocalError(''); clearError(); }}
            style={{
              background: 'none', border: 'none',
              color: 'var(--color-text-inverse)', cursor: 'pointer',
              fontWeight: 600, fontSize: 'var(--font-size-sm)',
            }}
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
