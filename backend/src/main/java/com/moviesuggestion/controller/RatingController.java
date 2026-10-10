package com.moviesuggestion.controller;

import com.moviesuggestion.dto.RatingDto;
import com.moviesuggestion.entity.UserRating;
import com.moviesuggestion.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<UserRating> rateMovie(
            Authentication authentication,
            @Valid @RequestBody RatingDto dto) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(ratingService.rateMovie(userId, dto));
    }

    @GetMapping
    public ResponseEntity<List<UserRating>> getUserRatings(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(ratingService.getUserRatings(userId));
    }

    @GetMapping("/{tmdbId}")
    public ResponseEntity<?> getRatingForMovie(
            Authentication authentication,
            @PathVariable Integer tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType) {
        Long userId = (Long) authentication.getPrincipal();
        return ratingService.getUserRatingForMovie(userId, tmdbId, mediaType)
                .map(r -> ResponseEntity.ok((Object) r))
                .orElse(ResponseEntity.ok(Map.of("rated", false)));
    }

    @GetMapping("/community/{tmdbId}")
    public ResponseEntity<List<UserRating>> getCommunityRatings(
            @PathVariable Integer tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType) {
        return ResponseEntity.ok(ratingService.getCommunityRatings(tmdbId, mediaType));
    }
}
