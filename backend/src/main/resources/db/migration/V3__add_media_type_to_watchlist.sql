-- V3: Add media_type to watchlist for TV show support

ALTER TABLE watchlist ADD COLUMN IF NOT EXISTS media_type VARCHAR(10) NOT NULL DEFAULT 'movie';

-- Drop old unique constraint and create new one including media_type
ALTER TABLE watchlist DROP CONSTRAINT IF EXISTS unique_user_watchlist_movie;
ALTER TABLE watchlist ADD CONSTRAINT unique_user_watchlist_item UNIQUE (user_id, tmdb_id, media_type);
