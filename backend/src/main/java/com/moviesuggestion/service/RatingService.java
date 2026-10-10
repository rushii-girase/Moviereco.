package com.moviesuggestion.service;

import com.moviesuggestion.dto.RatingDto;
import com.moviesuggestion.entity.User;
import com.moviesuggestion.entity.UserRating;
import com.moviesuggestion.repository.UserRatingRepository;
import com.moviesuggestion.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    private final UserRatingRepository ratingRepository;
    private final UserRepository userRepository;

    public RatingService(UserRatingRepository ratingRepository, UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
    }

    public UserRating rateMovie(Long userId, RatingDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserRating> existing = ratingRepository
                .findByUserIdAndTmdbIdAndMediaType(userId, dto.getTmdbId(), dto.getMediaType());

        UserRating rating;
        if (existing.isPresent()) {
            rating = existing.get();
        } else {
            rating = UserRating.builder()
                    .user(user)
                    .tmdbId(dto.getTmdbId())
                    .mediaType(dto.getMediaType() != null ? dto.getMediaType() : "movie")
                    .build();
        }

        rating.setCinematography(dto.getCinematography());
        rating.setActing(dto.getActing());
        rating.setStory(dto.getStory());
        rating.setSoundtrack(dto.getSoundtrack());
        rating.setOverall(dto.getOverall());
        rating.setReviewText(dto.getReviewText());

        return ratingRepository.save(rating);
    }

    public List<UserRating> getUserRatings(Long userId) {
        return ratingRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    public Optional<UserRating> getUserRatingForMovie(Long userId, Integer tmdbId, String mediaType) {
        return ratingRepository.findByUserIdAndTmdbIdAndMediaType(userId, tmdbId, mediaType);
    }

    public List<UserRating> getCommunityRatings(Integer tmdbId, String mediaType) {
        return ratingRepository.findByTmdbIdAndMediaType(tmdbId, mediaType);
    }
}
