package com.moviesuggestion.service;

import com.moviesuggestion.dto.WatchlistDto;
import com.moviesuggestion.entity.User;
import com.moviesuggestion.entity.WatchlistItem;
import com.moviesuggestion.repository.UserRepository;
import com.moviesuggestion.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;

    public WatchlistService(WatchlistRepository watchlistRepository, UserRepository userRepository) {
        this.watchlistRepository = watchlistRepository;
        this.userRepository = userRepository;
    }

    public List<WatchlistItem> getUserWatchlist(Long userId) {
        return watchlistRepository.findByUserIdOrderByAddedAtDesc(userId);
    }

    public WatchlistItem addToWatchlist(Long userId, WatchlistDto dto) {
        if (watchlistRepository.existsByUserIdAndTmdbIdAndMediaType(userId, dto.getTmdbId(), dto.getMediaType())) {
            throw new RuntimeException("Already in watchlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WatchlistItem item = WatchlistItem.builder()
                .user(user)
                .tmdbId(dto.getTmdbId())
                .title(dto.getTitle())
                .posterPath(dto.getPosterPath())
                .releaseYear(dto.getReleaseYear())
                .rating(dto.getRating())
                .mediaType(dto.getMediaType() != null ? dto.getMediaType() : "movie")
                .build();

        return watchlistRepository.save(item);
    }

    @Transactional
    public void removeFromWatchlist(Long userId, Integer tmdbId, String mediaType) {
        watchlistRepository.deleteByUserIdAndTmdbIdAndMediaType(userId, tmdbId, mediaType);
    }

    public boolean isInWatchlist(Long userId, Integer tmdbId, String mediaType) {
        return watchlistRepository.existsByUserIdAndTmdbIdAndMediaType(userId, tmdbId, mediaType);
    }
}
