package com.moviesuggestion.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "list_items")
public class ListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id", nullable = false)
    private CustomList customList;

    @Column(name = "tmdb_id", nullable = false)
    private Integer tmdbId;

    @Column(name = "media_type", nullable = false)
    private String mediaType = "movie";

    @Column(nullable = false)
    private String title;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "added_at")
    private OffsetDateTime addedAt;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    public ListItem() {}

    public ListItem(Long id, CustomList customList, Integer tmdbId, String mediaType, String title, String posterPath, OffsetDateTime addedAt, Integer sortOrder) {
        this.id = id;
        this.customList = customList;
        this.tmdbId = tmdbId;
        this.mediaType = mediaType != null ? mediaType : "movie";
        this.title = title;
        this.posterPath = posterPath;
        this.addedAt = addedAt;
        this.sortOrder = sortOrder != null ? sortOrder : 0;
    }

    public static ListItemBuilder builder() { return new ListItemBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    @JsonIgnore
    public CustomList getCustomList() { return customList; }
    public void setCustomList(CustomList customList) { this.customList = customList; }
    public Integer getTmdbId() { return tmdbId; }
    public void setTmdbId(Integer tmdbId) { this.tmdbId = tmdbId; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }
    public OffsetDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(OffsetDateTime addedAt) { this.addedAt = addedAt; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    @PrePersist
    protected void onCreate() {
        addedAt = OffsetDateTime.now();
    }

    public static class ListItemBuilder {
        private Long id;
        private CustomList customList;
        private Integer tmdbId;
        private String mediaType = "movie";
        private String title;
        private String posterPath;
        private OffsetDateTime addedAt;
        private Integer sortOrder = 0;

        public ListItemBuilder id(Long id) { this.id = id; return this; }
        public ListItemBuilder customList(CustomList customList) { this.customList = customList; return this; }
        public ListItemBuilder tmdbId(Integer tmdbId) { this.tmdbId = tmdbId; return this; }
        public ListItemBuilder mediaType(String mediaType) { this.mediaType = mediaType; return this; }
        public ListItemBuilder title(String title) { this.title = title; return this; }
        public ListItemBuilder posterPath(String posterPath) { this.posterPath = posterPath; return this; }
        public ListItemBuilder addedAt(OffsetDateTime addedAt) { this.addedAt = addedAt; return this; }
        public ListItemBuilder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }
        public ListItem build() { return new ListItem(id, customList, tmdbId, mediaType, title, posterPath, addedAt, sortOrder); }
    }
}
