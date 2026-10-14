import React, { useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '../api/backend';
import { loginUser, registerUser, fetchCurrentUser } from '../api/backend';
import { AuthContext } from './AuthContextDefinition';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth');

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Validate session in background on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth');

    if (stored) {
      fetchCurrentUser().catch(() => {
        localStorage.removeItem('auth');
        setUser(null);
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);

    try {
      const authUser = await loginUser(email, password);

      localStorage.setItem('auth', JSON.stringify(authUser));
      setUser(authUser);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed';

      setError(msg);
      throw e;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);

    try {
      const authUser = await registerUser(name, email, password);

      localStorage.setItem('auth', JSON.stringify(authUser));
      setUser(authUser);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registration failed';

      setError(msg);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth');
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
