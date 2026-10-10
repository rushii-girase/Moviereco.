import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, Bookmark, Award, Palette, Trophy, List, LogOut } from 'lucide-react';
import { SearchAutocomplete } from '../SearchAutocomplete/SearchAutocomplete';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          <Film className={styles.logoAccent} size={24} />
          <span>Movie<span className={styles.logoAccent}>Reco</span></span>
        </NavLink>

        {/* Search Bar */}
        <SearchAutocomplete />

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/discover"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Discover
          </NavLink>
          <NavLink
            to="/top-lists"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Award size={16} /> Top Lists
            </span>
          </NavLink>
          <NavLink
            to="/film-movements"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Palette size={16} /> Eras
            </span>
          </NavLink>
          <NavLink
            to="/awards"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Trophy size={16} /> Awards
            </span>
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Bookmark size={16} /> Wishlist
            </span>
          </NavLink>
          {isLoggedIn && (
            <NavLink
              to="/my-lists"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <List size={16} /> Lists
              </span>
            </NavLink>
          )}
        </nav>

        <div className={styles.authGroup}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                {user?.name}
              </span>
              <button
                onClick={logout}
                className={styles.navLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={styles.navLink}>
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};
