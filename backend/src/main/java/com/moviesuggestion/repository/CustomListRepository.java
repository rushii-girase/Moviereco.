package com.moviesuggestion.repository;

import com.moviesuggestion.entity.CustomList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CustomListRepository extends JpaRepository<CustomList, Long> {
    List<CustomList> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<CustomList> findByShareCode(String shareCode);
    Optional<CustomList> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndName(Long userId, String name);
}
