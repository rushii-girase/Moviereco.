package com.moviesuggestion.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "watchlist")
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "tmdb_id", nullable = false)
    private Integer tmdbId;

    @Column(nullable = false)
    private String title;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating;

    @Column(name = "media_type", nullable = false)
    private String mediaType = "movie";

    @Column(name = "added_at")
    private OffsetDateTime addedAt;

    public WatchlistItem() {}

    public WatchlistItem(Long id, User user, Integer tmdbId, String title, String posterPath, Integer releaseYear, BigDecimal rating, String mediaType, OffsetDateTime addedAt) {
        this.id = id;
        this.user = user;
        this.tmdbId = tmdbId;
        this.title = title;
        this.posterPath = posterPath;
        this.releaseYear = releaseYear;
        this.rating = rating;
        this.mediaType = mediaType != null ? mediaType : "movie";
        this.addedAt = addedAt;
    }

    public static WatchlistItemBuilder builder() { return new WatchlistItemBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Integer getTmdbId() { return tmdbId; }
    public void setTmdbId(Integer tmdbId) { this.tmdbId = tmdbId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }
    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public OffsetDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(OffsetDateTime addedAt) { this.addedAt = addedAt; }

    @PrePersist
    protected void onCreate() {
        addedAt = OffsetDateTime.now();
    }

    public static class WatchlistItemBuilder {
        private Long id;
        private User user;
        private Integer tmdbId;
        private String title;
        private String posterPath;
        private Integer releaseYear;
        private BigDecimal rating;
        private String mediaType = "movie";
        private OffsetDateTime addedAt;

        public WatchlistItemBuilder id(Long id) { this.id = id; return this; }
        public WatchlistItemBuilder user(User user) { this.user = user; return this; }
        public WatchlistItemBuilder tmdbId(Integer tmdbId) { this.tmdbId = tmdbId; return this; }
        public WatchlistItemBuilder title(String title) { this.title = title; return this; }
        public WatchlistItemBuilder posterPath(String posterPath) { this.posterPath = posterPath; return this; }
        public WatchlistItemBuilder releaseYear(Integer releaseYear) { this.releaseYear = releaseYear; return this; }
        public WatchlistItemBuilder rating(BigDecimal rating) { this.rating = rating; return this; }
        public WatchlistItemBuilder mediaType(String mediaType) { this.mediaType = mediaType; return this; }
        public WatchlistItemBuilder addedAt(OffsetDateTime addedAt) { this.addedAt = addedAt; return this; }
        public WatchlistItem build() { return new WatchlistItem(id, user, tmdbId, title, posterPath, releaseYear, rating, mediaType, addedAt); }
    }
}
