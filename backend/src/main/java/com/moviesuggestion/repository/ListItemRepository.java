package com.moviesuggestion.repository;

import com.moviesuggestion.entity.ListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ListItemRepository extends JpaRepository<ListItem, Long> {
    List<ListItem> findByCustomListIdOrderBySortOrderAsc(Long listId);
    Optional<ListItem> findByCustomListIdAndTmdbIdAndMediaType(Long listId, Integer tmdbId, String mediaType);
    boolean existsByCustomListIdAndTmdbIdAndMediaType(Long listId, Integer tmdbId, String mediaType);
    void deleteByCustomListIdAndTmdbIdAndMediaType(Long listId, Integer tmdbId, String mediaType);
}
