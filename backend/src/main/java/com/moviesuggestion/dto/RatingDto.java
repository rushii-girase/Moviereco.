package com.moviesuggestion.dto;

import jakarta.validation.constraints.*;

public class RatingDto {
    @NotNull(message = "TMDB ID is required")
    private Integer tmdbId;

    private String mediaType = "movie";

    @Min(1) @Max(10)
    private Short cinematography;

    @Min(1) @Max(10)
    private Short acting;

    @Min(1) @Max(10)
    private Short story;

    @Min(1) @Max(10)
    private Short soundtrack;

    @Min(1) @Max(10)
    @NotNull(message = "Overall rating is required")
    private Short overall;

    private String reviewText;

    public RatingDto() {}

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
}
