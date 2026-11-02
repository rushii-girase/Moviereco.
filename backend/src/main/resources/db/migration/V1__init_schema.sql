-- Initial database migration schema for Movie Suggestion App

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS watchlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tmdb_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    release_year INT,
    rating NUMERIC(3, 1),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_watchlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_watchlist_movie UNIQUE (user_id, tmdb_id),
    INDEX idx_watchlist_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
