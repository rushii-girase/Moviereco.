package com.moviesuggestion.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TmdbService {

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.token}")
    private String apiToken;

    @Value("${tmdb.api.base-url}")
    private String baseUrl;

    public TmdbService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpHeaders getAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        if (apiToken != null && !apiToken.isBlank()) {
            headers.setBearerAuth(apiToken.trim());
        }
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    @Cacheable(value = "tmdb-trending", key = "#mediaType + '-' + #timeWindow")
    public JsonNode getTrending(String mediaType, String timeWindow) {
        String url = baseUrl + "/trending/" + mediaType + "/" + timeWindow;
        return callTmdb(url);
    }

    @Cacheable(value = "tmdb-popular", key = "#mediaType + '-' + #page")
    public JsonNode getPopular(String mediaType, int page) {
        String url = baseUrl + "/" + mediaType + "/popular?page=" + page;
        return callTmdb(url);
    }

    @Cacheable(value = "tmdb-upcoming")
    public JsonNode getUpcoming(int page) {
        String url = baseUrl + "/movie/upcoming?page=" + page;
        return callTmdb(url);
    }

    @Cacheable(value = "tmdb-top-rated", key = "#mediaType + '-' + #page")
    public JsonNode getTopRated(String mediaType, int page) {
        String url = baseUrl + "/" + mediaType + "/top_rated?page=" + page;
        return callTmdb(url);
    }

    @Cacheable(value = "tmdb-details", key = "#mediaType + '-' + #id")
    public JsonNode getDetails(String mediaType, int id) {
        String url = baseUrl + "/" + mediaType + "/" + id + "?append_to_response=credits,videos,watch/providers,keywords,recommendations,similar";
        return callTmdb(url);
    }

    @Cacheable(value = "tmdb-person", key = "#id")
    public JsonNode getPersonDetails(int id) {
        String url = baseUrl + "/person/" + id + "?append_to_response=combined_credits,external_ids";
        return callTmdb(url);
    }

    @Cacheable(value = "tmdb-genres", key = "#mediaType")
    public JsonNode getGenres(String mediaType) {
        String url = baseUrl + "/genre/" + mediaType + "/list";
        return callTmdb(url);
    }

    @Cacheable(value = "tmdb-search", key = "#query + '-' + #mediaType + '-' + #page")
    public JsonNode search(String mediaType, String query, int page) {
        String url = baseUrl + "/search/" + mediaType + "?query=" + query + "&page=" + page;
        return callTmdb(url);
    }

    public JsonNode searchMulti(String query, int page) {
        String url = baseUrl + "/search/multi?query=" + query + "&page=" + page;
        return callTmdb(url);
    }

    @Cacheable(value = "tmdb-discover", key = "#mediaType + '-' + #params")
    public JsonNode discover(String mediaType, String params) {
        String url = baseUrl + "/discover/" + mediaType + "?" + params;
        return callTmdb(url);
    }

    public JsonNode getCollection(int id) {
        String url = baseUrl + "/collection/" + id;
        return callTmdb(url);
    }

    public JsonNode getSeasonDetails(int tvId, int seasonNumber) {
        String url = baseUrl + "/tv/" + tvId + "/season/" + seasonNumber;
        return callTmdb(url);
    }

    private JsonNode callTmdb(String url) {
        if (apiToken == null || apiToken.isBlank()) {
            throw new RuntimeException("TMDB token is not configured. Please set the TMDB_TOKEN environment variable.");
        }
        HttpEntity<Void> entity = new HttpEntity<>(getAuthHeaders());
        ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);
        return response.getBody();
    }
}
