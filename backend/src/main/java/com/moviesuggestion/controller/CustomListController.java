package com.moviesuggestion.controller;

import com.moviesuggestion.dto.CustomListDto;
import com.moviesuggestion.dto.ListItemDto;
import com.moviesuggestion.entity.CustomList;
import com.moviesuggestion.entity.ListItem;
import com.moviesuggestion.service.CustomListService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
public class CustomListController {

    private final CustomListService listService;

    public CustomListController(CustomListService listService) {
        this.listService = listService;
    }

    @PostMapping
    public ResponseEntity<CustomList> createList(
            Authentication authentication,
            @Valid @RequestBody CustomListDto dto) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(listService.createList(userId, dto));
    }

    @GetMapping
    public ResponseEntity<List<CustomList>> getUserLists(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(listService.getUserLists(userId));
    }

    @GetMapping("/{listId}")
    public ResponseEntity<CustomList> getList(
            Authentication authentication,
            @PathVariable Long listId) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(listService.getListById(listId, userId));
    }

    @PutMapping("/{listId}")
    public ResponseEntity<CustomList> updateList(
            Authentication authentication,
            @PathVariable Long listId,
            @Valid @RequestBody CustomListDto dto) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(listService.updateList(listId, userId, dto));
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<?> deleteList(
            Authentication authentication,
            @PathVariable Long listId) {
        Long userId = (Long) authentication.getPrincipal();
        listService.deleteList(listId, userId);
        return ResponseEntity.ok(Map.of("message", "List deleted"));
    }

    // List items management
    @PostMapping("/{listId}/items")
    public ResponseEntity<ListItem> addItem(
            Authentication authentication,
            @PathVariable Long listId,
            @Valid @RequestBody ListItemDto dto) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(listService.addItemToList(listId, userId, dto));
    }

    @GetMapping("/{listId}/items")
    public ResponseEntity<List<ListItem>> getItems(@PathVariable Long listId) {
        return ResponseEntity.ok(listService.getListItems(listId));
    }

    @DeleteMapping("/{listId}/items/{tmdbId}")
    public ResponseEntity<?> removeItem(
            Authentication authentication,
            @PathVariable Long listId,
            @PathVariable Integer tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType) {
        Long userId = (Long) authentication.getPrincipal();
        listService.removeItemFromList(listId, userId, tmdbId, mediaType);
        return ResponseEntity.ok(Map.of("message", "Item removed from list"));
    }

    // Shared list (public, no auth needed)
    @GetMapping("/shared/{shareCode}")
    public ResponseEntity<CustomList> getSharedList(@PathVariable String shareCode) {
        return ResponseEntity.ok(listService.getSharedList(shareCode));
    }
}
