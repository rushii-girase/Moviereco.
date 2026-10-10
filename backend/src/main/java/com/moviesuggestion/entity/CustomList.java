package com.moviesuggestion.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "custom_lists")
public class CustomList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    private String description;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @Column(name = "share_code", length = 36)
    private String shareCode;

    @OneToMany(mappedBy = "customList", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public CustomList() {}

    public CustomList(Long id, User user, String name, String description, Boolean isPublic, String shareCode, List<ListItem> items, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.description = description;
        this.isPublic = isPublic != null ? isPublic : false;
        this.shareCode = shareCode;
        this.items = items != null ? items : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static CustomListBuilder builder() { return new CustomListBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    public String getShareCode() { return shareCode; }
    public void setShareCode(String shareCode) { this.shareCode = shareCode; }
    public List<ListItem> getItems() { return items; }
    public void setItems(List<ListItem> items) { this.items = items; }
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

    public static class CustomListBuilder {
        private Long id;
        private User user;
        private String name;
        private String description;
        private Boolean isPublic = false;
        private String shareCode;
        private List<ListItem> items = new ArrayList<>();
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;

        public CustomListBuilder id(Long id) { this.id = id; return this; }
        public CustomListBuilder user(User user) { this.user = user; return this; }
        public CustomListBuilder name(String name) { this.name = name; return this; }
        public CustomListBuilder description(String description) { this.description = description; return this; }
        public CustomListBuilder isPublic(Boolean isPublic) { this.isPublic = isPublic; return this; }
        public CustomListBuilder shareCode(String shareCode) { this.shareCode = shareCode; return this; }
        public CustomListBuilder items(List<ListItem> items) { this.items = items; return this; }
        public CustomListBuilder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CustomListBuilder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public CustomList build() { return new CustomList(id, user, name, description, isPublic, shareCode, items, createdAt, updatedAt); }
    }
}
