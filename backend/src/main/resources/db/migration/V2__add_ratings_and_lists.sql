-- V2: Add multi-dimensional ratings and custom lists

CREATE TABLE IF NOT EXISTS user_ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tmdb_id INT NOT NULL,
    media_type VARCHAR(10) NOT NULL DEFAULT 'movie',
    cinematography SMALLINT CHECK (cinematography >= 1 AND cinematography <= 10),
    acting SMALLINT CHECK (acting >= 1 AND acting <= 10),
    story SMALLINT CHECK (story >= 1 AND story <= 10),
    soundtrack SMALLINT CHECK (soundtrack >= 1 AND soundtrack <= 10),
    overall SMALLINT CHECK (overall >= 1 AND overall <= 10),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_rating UNIQUE (user_id, tmdb_id, media_type),
    INDEX idx_user_ratings_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS custom_lists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    share_code VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_custom_lists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_list_name UNIQUE (user_id, name),
    INDEX idx_custom_lists_user_id (user_id),
    INDEX idx_custom_lists_share_code (share_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS list_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    list_id BIGINT NOT NULL,
    tmdb_id INT NOT NULL,
    media_type VARCHAR(10) NOT NULL DEFAULT 'movie',
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sort_order INT DEFAULT 0,
    CONSTRAINT fk_list_items_list FOREIGN KEY (list_id) REFERENCES custom_lists(id) ON DELETE CASCADE,
    CONSTRAINT unique_list_item UNIQUE (list_id, tmdb_id, media_type),
    INDEX idx_list_items_list_id (list_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
