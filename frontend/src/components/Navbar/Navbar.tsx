import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, Bookmark, Trophy, List, LogOut, Compass, Layers } from 'lucide-react';
import { SearchAutocomplete } from '../SearchAutocomplete/SearchAutocomplete';
import { useAuth } from '../../context/useAuth';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo} aria-label="Moviereco Home">
          <Film className={styles.logoIcon} size={20} />
          <span>MOVIE<span className={styles.logoAccent}>RECO</span></span>
        </NavLink>

        <SearchAutocomplete />

        <nav className={styles.nav} aria-label="Main Navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/discover"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Compass size={15} className={styles.navIcon} />
            <span>Discover</span>
          </NavLink>

          <NavLink
            to="/top-lists"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Trophy size={15} className={styles.navIcon} />
            <span>Top Rated</span>
          </NavLink>

          <NavLink
            to="/film-movements"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Layers size={15} className={styles.navIcon} />
            <span>Movements</span>
          </NavLink>

          <NavLink
            to="/awards"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Trophy size={15} className={styles.navIcon} />
            <span>Awards</span>
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Bookmark size={15} className={styles.navIcon} />
            <span>Wishlist</span>
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/my-lists"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <List size={15} className={styles.navIcon} />
              <span>My Lists</span>
            </NavLink>
          )}
        </nav>

        <div className={styles.authGroup}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <span className={styles.userBadge}>{user?.name}</span>
              <button
                type="button"
                onClick={logout}
                className={styles.signOutBtn}
                title="Sign out of account"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={styles.signInBtn}>
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};
