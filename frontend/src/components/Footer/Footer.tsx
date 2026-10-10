import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.attribution}>
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3f92016701ae9d3d4598a65030d457805013.svg"
            alt="TMDB Logo"
            className={styles.tmdbLogo}
          />
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
        <p style={{ color: 'var(--color-text-tertiary)' }}>
          © 2026 MovieReco · Technology Study Project
        </p>
      </div>
    </footer>
  );
};
