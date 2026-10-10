package com.moviesuggestion.repository;

import com.moviesuggestion.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserIdOrderByAddedAtDesc(Long userId);
    Optional<WatchlistItem> findByUserIdAndTmdbIdAndMediaType(Long userId, Integer tmdbId, String mediaType);
    boolean existsByUserIdAndTmdbIdAndMediaType(Long userId, Integer tmdbId, String mediaType);
    void deleteByUserIdAndTmdbIdAndMediaType(Long userId, Integer tmdbId, String mediaType);
    long countByUserId(Long userId);
}
