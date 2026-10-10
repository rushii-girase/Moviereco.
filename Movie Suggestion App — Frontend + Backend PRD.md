# Movie Suggestion App: Product Requirements Document (Frontend + Backend)

Version 1.1 · 8 October 2026 · Stack: Java 17 + Spring Boot 3.2+ / React · Data: TMDB API · Design language: INDEX 0

## 1. Context and Goals

### 1.1 Design intent

A dark, content-first, token-driven movie discovery app for studying modern web technologies (React, TypeScript, Spring Boot, TMDB API integration, PostgreSQL). Every screen helps a user find good movies by exploring categories, years of release, ratings, actors, and directors, while adhering strictly to the INDEX 0 token set for visual design.

### 1.2 Purpose & Philosophy

This project is built primarily as a **technology study codebase**. The architecture and scope prioritize clean code, solid patterns, accessibility, and high developer ergonomics over enterprise complexity. We avoid over-engineering (no Redis, no complex Machine Learning / MovieLens batch jobs, no multi-stage hybrid recommendation algorithms).

### 1.3 Core Goals

- **Discovery & Search:** Let visitors and users easily browse and filter movies by **Genres**, **Release Years**, **Ratings**, and **Actors or Directors**.
- **Wishlist:** Let registered users save and manage movies in their personal Wishlist.
- **Design Consistency:** Ship a dark-mode, responsive, and accessible UI (WCAG 2.2 AA) built strictly from INDEX 0 design tokens without altering the design language.
- **Free-Tier Tech Study:** Run cleanly using standard free tools (TMDB non-commercial API, local/free PostgreSQL, standard JWT auth).

### 1.4 Non-Goals

- Machine Learning / Collaborative Filtering / MovieLens imports.
- Redis distributed caching or complex background batch workers.
- Streaming playback, social feeds, or commercial monetization.
- Native mobile apps (responsive web design is used instead).

### 1.5 Target User Flows

| Persona | Primary Goal | Key Flow |
| --- | --- | --- |
| Visitor / Student | Explore movies by specific criteria | Home -> Discover (filter by genre, year, rating, actor/director) -> Movie Details |
| Registered User | Save movies to watch later | Register/Login -> Browse -> Add/Remove Wishlist -> View /watchlist |

### 1.6 Success Metrics

- Clean separation of concerns between Spring Boot backend (REST) and React + Vite frontend.
- Zero raw hex values in UI components (100% token usage).
- Page load under 1.2s for uncached TMDB queries; p95 under 300ms for cached queries.
- Lighthouse Accessibility score of 95+ on all pages.

---

## 2. Simplified System Scope

| Component | Scope & Requirements |
| --- | --- |
| **Frontend** | React 18 + TS + Vite, React Router, TanStack Query, CSS Modules with `tokens.css`. Pages: Home, Discover (Filter by Genre/Year/Rating/Actor/Director), Movie Details, Wishlist, Auth (Login/Register), 404. |
| **Backend** | Spring Boot 3.2+ (Java 17), PostgreSQL, Spring Data JPA, Flyway, Spring Security + JWT, Caffeine Cache for TMDB requests, REST Controllers for Auth, Movies, and Wishlist. |

---

## 3. Design Tokens and Foundations (INDEX 0)

> **Important:** The visual style and design language remain **100% unchanged** from the original INDEX 0 design system.

### 3.1 Source Tokens

| Token | Value | Use |
| --- | --- | --- |
| `color.surface.base` | `#000000` | Main background |
| `color.surface.muted` | `#0b0e13` | Section backgrounds, input fills |
| `color.surface.raised` | `#10141b` | Cards, menus, modals |
| `color.text.primary` | `#9aa4b2` | Body text |
| `color.text.secondary` | `#eef1f5` | Headings, hover text, emphasis |
| `color.text.tertiary` | `#626c7a` | Disabled & decorative text only |
| `color.text.inverse` | `#1cd6ac` | Accent color: buttons, active states, links |
| `color.border.strong` | `#ffffff` | Focus indicators, strong dividers |
| `font.family.stack` | `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif` | Typography |
| `font.size.base / lineHeight.base` | `13.6px / 21.08px` | Body font size |
| `radius.xs / sm / md / lg` | `7px / 8px / 12px / 16px` | Chips, buttons, cards, dialogs |
| `motion.duration.instant` | `150ms` | Smooth transitions |

### 3.2 Required Token Additions

| Token | Value | Purpose |
| --- | --- | --- |
| `color.state.error` | `#ff6b6b` | Error messages, destructive actions |
| `color.state.success` | `#1cd6ac` | Success notifications / toasts |
| `color.border.subtle` | `#1d2430` | Subtle card & input borders |
| `color.focus.ring` | `#ffffff` | High-visibility focus ring |
| `space.1` to `space.13` | `1px` to `48px` | Layout & element gaps |
| `layout.maxWidth` | `1200px` | Main content container width |

### 3.3 Responsive & Motion Rules

- **Breakpoints:** Mobile (0-599px), Tablet (600-1023px), Desktop (1024px+).
- **Grid Layout:** 2 columns (mobile), 4 (tablet), 6 (desktop). Movie posters maintain a strict 2:3 aspect ratio.
- **Motion:** All animations transition in 150ms. Respect `prefers-reduced-motion: reduce`.

---

## 4. Frontend Requirements

### 4.1 Tech Stack & Structure

- **Stack:** React 18, TypeScript, Vite, TanStack Query (fetching & caching), React Router v6, CSS Modules.
- **Folder Structure:**
```
src/
  styles/tokens.css, base.css
  api/          (TMDB & Backend API client)
  features/     movies, discover, wishlist, auth
  components/   Button, MovieCard, MovieGrid, SearchInput, FilterBar, WishlistButton, Toast, Skeleton
  routes/       HomePage, DiscoverPage, MovieDetailsPage, WishlistPage, LoginPage, RegisterPage
```

### 4.2 Routes & Pages

| Route | Page Name | Auth Required | Key Features & Content |
| --- | --- | --- | --- |
| `/` | Home | No | Trending movies, Top Rated movies, Hero banner |
| `/discover` | Discover / Search | No | Filter bar (Genre, Release Year, Min Rating, Actor/Director name), Results Grid, Pagination |
| `/movie/:id` | Movie Details | No | Poster, Overview, Rating, Release Year, Genres, Cast & Director list, Wishlist button |
| `/watchlist` | My Wishlist | Yes | Grid of saved movies with quick remove action |
| `/login`, `/register` | Authentication | No | Login and Register forms with client-side validation |
| `*` | 404 Not Found | No | 404 message with button back to Home |

### 4.3 Interactive Component States

All interactive elements (buttons, inputs, cards) must implement 7 states:
1. **Default:** Surface background, subtle border.
2. **Hover:** Text brightens to `color.text.secondary`, border highlights to accent (150ms).
3. **Focus-visible:** 2px solid white focus ring with 2px offset.
4. **Active:** Pressed state (`color.surface.muted`).
5. **Disabled:** Opacity reduced, `cursor: not-allowed`.
6. **Loading:** Spinner/Skeleton state with `aria-busy="true"`.
7. **Error:** Red border (`color.state.error`) and descriptive text.

---

## 5. Backend Requirements

### 5.1 Tech Stack & Architecture

- **Stack:** Java 17, Spring Boot 3.2+, PostgreSQL, Spring Data JPA, Flyway, Spring Security (JWT), Caffeine Cache.
- **Architecture Layers:** `controller` -> `service` -> `repository` / `client` -> `dto`. Never expose raw JPA entities directly in API endpoints.

### 5.2 Database Schema

```sql
-- Users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist
CREATE TABLE watchlist (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    tmdb_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    release_year INT,
    rating NUMERIC(3, 1),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie UNIQUE (user_id, tmdb_id)
);
```

### 5.3 REST API Specifications

| Method | Path | Auth Required | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Create user account & return JWT token |
| `POST` | `/api/auth/login` | No | Authenticate user & return JWT token |
| `GET` | `/api/users/me` | Yes | Get current user profile |
| `GET` | `/api/movies/popular` | No | Fetch popular movies from TMDB |
| `GET` | `/api/movies/trending` | No | Fetch trending movies from TMDB |
| `GET` | `/api/movies/discover` | No | Discover movies with query params: `genre`, `year`, `rating`, `person` (actor/director), `page` |
| `GET` | `/api/movies/{id}` | No | Fetch movie details including Cast & Crew |
| `GET` | `/api/watchlist` | Yes | Fetch user's saved wishlist movies |
| `POST` | `/api/watchlist` | Yes | Add movie to user's wishlist |
| `DELETE` | `/api/watchlist/{tmdbId}` | Yes | Remove movie from user's wishlist |

### 5.4 TMDB API Integration & Caching

- **Authentication:** Read Access Token (`TMDB_TOKEN`).
- **Caching (Caffeine):**
  - Popular & Trending: TTL 1 hour.
  - Discover & Search: TTL 30 minutes.
  - Movie Details & Cast: TTL 24 hours.
- **TMDB Attribution:** Footer must display TMDB logo and official attribution text per TMDB terms.

---

## 6. Accessibility & Quality Standards (WCAG 2.2 AA)

- **Keyboard Navigation:** Full Tab/Shift+Tab support with visible focus outlines on all interactive elements.
- **Alt Text:** Every movie poster includes alt text (`Poster of {movie_title}`).
- **Semantics:** HTML5 landmarks (`header`, `nav`, `main`, `footer`), single `h1` per page.
- **Responsive:** Fluid scaling down to 320px width without horizontal scrollbars.

---

## 7. Implementation Roadmap (Simplified for Study)

| Week | Focus Area | Deliverables |
| --- | --- | --- |
| **Week 1** | Setup & Design System | Spring Boot project setup, Vite + React setup, `tokens.css`, basic layout & components. |
| **Week 2** | Backend API & TMDB Client | `TmdbClient` with Caffeine caching, Discover endpoint (genres, year, rating, actor/director filtering). |
| **Week 3** | Frontend Discover & Details | Home page, Discover page with filter bar, Movie Details page with cast/crew view. |
| **Week 4** | Auth & Wishlist | JWT Authentication (Register/Login), Wishlist DB table, Wishlist frontend page & toggle buttons. |
| **Week 5** | Polish & Testing | Accessibility checks, responsive testing, error handling, documentation & README setup. |
