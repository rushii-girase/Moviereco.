package com.moviesuggestion.controller;

import com.moviesuggestion.service.TmdbService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tmdb")
public class TmdbProxyController {

    private final TmdbService tmdbService;

    public TmdbProxyController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/trending/{mediaType}/{timeWindow}")
    public ResponseEntity<JsonNode> trending(
            @PathVariable String mediaType,
            @PathVariable String timeWindow) {
        return ResponseEntity.ok(tmdbService.getTrending(mediaType, timeWindow));
    }

    @GetMapping("/{mediaType}/popular")
    public ResponseEntity<JsonNode> popular(
            @PathVariable String mediaType,
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.getPopular(mediaType, page));
    }

    @GetMapping("/movie/upcoming")
    public ResponseEntity<JsonNode> upcoming(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.getUpcoming(page));
    }

    @GetMapping("/{mediaType}/top_rated")
    public ResponseEntity<JsonNode> topRated(
            @PathVariable String mediaType,
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.getTopRated(mediaType, page));
    }

    @GetMapping("/{mediaType}/{id}")
    public ResponseEntity<JsonNode> details(
            @PathVariable String mediaType,
            @PathVariable int id) {
        return ResponseEntity.ok(tmdbService.getDetails(mediaType, id));
    }

    @GetMapping("/person/{id}")
    public ResponseEntity<JsonNode> person(@PathVariable int id) {
        return ResponseEntity.ok(tmdbService.getPersonDetails(id));
    }

    @GetMapping("/genre/{mediaType}/list")
    public ResponseEntity<JsonNode> genres(@PathVariable String mediaType) {
        return ResponseEntity.ok(tmdbService.getGenres(mediaType));
    }

    @GetMapping("/search/{mediaType}")
    public ResponseEntity<JsonNode> search(
            @PathVariable String mediaType,
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.search(mediaType, query, page));
    }

    @GetMapping("/search/multi")
    public ResponseEntity<JsonNode> searchMulti(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(tmdbService.searchMulti(query, page));
    }

    @GetMapping("/discover/{mediaType}")
    public ResponseEntity<JsonNode> discover(
            @PathVariable String mediaType,
            @RequestParam String params) {
        return ResponseEntity.ok(tmdbService.discover(mediaType, params));
    }

    @GetMapping("/collection/{id}")
    public ResponseEntity<JsonNode> collection(@PathVariable int id) {
        return ResponseEntity.ok(tmdbService.getCollection(id));
    }

    @GetMapping("/tv/{tvId}/season/{seasonNumber}")
    public ResponseEntity<JsonNode> season(
            @PathVariable int tvId,
            @PathVariable int seasonNumber) {
        return ResponseEntity.ok(tmdbService.getSeasonDetails(tvId, seasonNumber));
    }
}
