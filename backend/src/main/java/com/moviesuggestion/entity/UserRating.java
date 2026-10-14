package com.moviesuggestion.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "user_ratings")
public class UserRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "tmdb_id", nullable = false)
    private Integer tmdbId;

    @Column(name = "media_type", nullable = false)
    private String mediaType = "movie";

    private Short cinematography;
    private Short acting;
    private Short story;
    private Short soundtrack;
    private Short overall;

    @Column(name = "review_text")
    private String reviewText;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public UserRating() {}

    public UserRating(Long id, User user, Integer tmdbId, String mediaType, Short cinematography, Short acting, Short story, Short soundtrack, Short overall, String reviewText, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.tmdbId = tmdbId;
        this.mediaType = mediaType != null ? mediaType : "movie";
        this.cinematography = cinematography;
        this.acting = acting;
        this.story = story;
        this.soundtrack = soundtrack;
        this.overall = overall;
        this.reviewText = reviewText;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UserRatingBuilder builder() { return new UserRatingBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    @JsonIgnore
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @JsonProperty("userName")
    public String getUserName() {
        return user != null ? user.getName() : null;
    }
    public Integer getTmdbId() { return tmdbId; }
    public void setTmdbId(Integer tmdbId) { this.tmdbId = tmdbId; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public Short getCinematography() { return cinematography; }
    public void setCinematography(Short cinematography) { this.cinematography = cinematography; }
    public Short getActing() { return acting; }
    public void setActing(Short acting) { this.acting = acting; }
    public Short getStory() { return story; }
    public void setStory(Short story) { this.story = story; }
    public Short getSoundtrack() { return soundtrack; }
    public void setSoundtrack(Short soundtrack) { this.soundtrack = soundtrack; }
    public Short getOverall() { return overall; }
    public void setOverall(Short overall) { this.overall = overall; }
    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public static class UserRatingBuilder {
        private Long id;
        private User user;
        private Integer tmdbId;
        private String mediaType = "movie";
        private Short cinematography;
        private Short acting;
        private Short story;
        private Short soundtrack;
        private Short overall;
        private String reviewText;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;

        public UserRatingBuilder id(Long id) { this.id = id; return this; }
        public UserRatingBuilder user(User user) { this.user = user; return this; }
        public UserRatingBuilder tmdbId(Integer tmdbId) { this.tmdbId = tmdbId; return this; }
        public UserRatingBuilder mediaType(String mediaType) { this.mediaType = mediaType; return this; }
        public UserRatingBuilder cinematography(Short cinematography) { this.cinematography = cinematography; return this; }
        public UserRatingBuilder acting(Short acting) { this.acting = acting; return this; }
        public UserRatingBuilder story(Short story) { this.story = story; return this; }
        public UserRatingBuilder soundtrack(Short soundtrack) { this.soundtrack = soundtrack; return this; }
        public UserRatingBuilder overall(Short overall) { this.overall = overall; return this; }
        public UserRatingBuilder reviewText(String reviewText) { this.reviewText = reviewText; return this; }
        public UserRatingBuilder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserRatingBuilder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public UserRating build() { return new UserRating(id, user, tmdbId, mediaType, cinematography, acting, story, soundtrack, overall, reviewText, createdAt, updatedAt); }
    }
}
