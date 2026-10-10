package com.moviesuggestion.controller;

import com.moviesuggestion.dto.WatchlistDto;
import com.moviesuggestion.entity.WatchlistItem;
import com.moviesuggestion.service.WatchlistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<List<WatchlistItem>> getWatchlist(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(watchlistService.getUserWatchlist(userId));
    }

    @PostMapping
    public ResponseEntity<WatchlistItem> addToWatchlist(
            Authentication authentication,
            @Valid @RequestBody WatchlistDto dto) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(watchlistService.addToWatchlist(userId, dto));
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<?> removeFromWatchlist(
            Authentication authentication,
            @PathVariable Integer tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType) {
        Long userId = (Long) authentication.getPrincipal();
        watchlistService.removeFromWatchlist(userId, tmdbId, mediaType);
        return ResponseEntity.ok(Map.of("message", "Removed from watchlist"));
    }

    @GetMapping("/check/{tmdbId}")
    public ResponseEntity<Map<String, Boolean>> checkWatchlist(
            Authentication authentication,
            @PathVariable Integer tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType) {
        Long userId = (Long) authentication.getPrincipal();
        boolean exists = watchlistService.isInWatchlist(userId, tmdbId, mediaType);
        return ResponseEntity.ok(Map.of("inWatchlist", exists));
    }
}
