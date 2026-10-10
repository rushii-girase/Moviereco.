-- V2: Add multi-dimensional ratings and custom lists

CREATE TABLE IF NOT EXISTS user_ratings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tmdb_id INT NOT NULL,
    media_type VARCHAR(10) NOT NULL DEFAULT 'movie',
    cinematography SMALLINT CHECK (cinematography >= 1 AND cinematography <= 10),
    acting SMALLINT CHECK (acting >= 1 AND acting <= 10),
    story SMALLINT CHECK (story >= 1 AND story <= 10),
    soundtrack SMALLINT CHECK (soundtrack >= 1 AND soundtrack <= 10),
    overall SMALLINT CHECK (overall >= 1 AND overall <= 10),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_rating UNIQUE (user_id, tmdb_id, media_type)
);

CREATE TABLE IF NOT EXISTS custom_lists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    share_code VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_list_name UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS list_items (
    id BIGSERIAL PRIMARY KEY,
    list_id BIGINT NOT NULL REFERENCES custom_lists(id) ON DELETE CASCADE,
    tmdb_id INT NOT NULL,
    media_type VARCHAR(10) NOT NULL DEFAULT 'movie',
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sort_order INT DEFAULT 0,
    CONSTRAINT unique_list_item UNIQUE (list_id, tmdb_id, media_type)
);

CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_lists_user_id ON custom_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_lists_share_code ON custom_lists(share_code);
CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON list_items(list_id);
