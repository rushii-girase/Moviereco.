package com.moviesuggestion.repository;

import com.moviesuggestion.entity.UserRating;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRatingRepository extends JpaRepository<UserRating, Long> {
    List<UserRating> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<UserRating> findByUserIdAndTmdbIdAndMediaType(Long userId, Integer tmdbId, String mediaType);

    @EntityGraph(attributePaths = {"user"})
    List<UserRating> findByTmdbIdAndMediaType(Integer tmdbId, String mediaType);
}
