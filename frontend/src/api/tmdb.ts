// Client-side TMDB API service with full feature support

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
}

export interface CollectionPart {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
}

export interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  genres: Genre[];
  tagline: string;
  belongs_to_collection?: { id: number; name: string; poster_path: string | null; backdrop_path: string | null };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: VideoResult[];
  };
  seasons?: Season[];
  'watch/providers'?: {
    results?: {
      US?: { flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[]; link?: string };
      GB?: { flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[]; link?: string };
    };
  };
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for?: { id: number; title?: string; name?: string; poster_path: string | null }[];
  combined_credits?: {
    cast: { id: number; title?: string; name?: string; poster_path: string | null; release_date?: string; first_air_date?: string; character?: string; vote_average: number; media_type: string }[];
    crew: { id: number; title?: string; name?: string; poster_path: string | null; release_date?: string; first_air_date?: string; job: string; vote_average: number; media_type: string }[];
  };
}

interface RawMediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

const formatMedia = (m: RawMediaItem, defaultType: 'movie' | 'tv' = 'movie') => {
  const releaseStr = m.release_date || m.first_air_date;
  const parsedYear = releaseStr ? parseInt(releaseStr.split('-')[0], 10) : undefined;

  return {
    id: m.id,
    title: m.title || m.name || 'Untitled',
    posterPath: m.poster_path,
    releaseYear: parsedYear,
    rating: m.vote_average,
    mediaType: m.title ? 'movie' : m.first_air_date ? 'tv' : defaultType,
  };
};

export const fetchTrendingMovies = async () => {
  const res = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`);

  if (!res.ok) {
    throw new Error('Failed to fetch trending movies');
  }

  const data = await res.json();

  return (data.results || []).map((item: RawMediaItem) => formatMedia(item));
};

export const fetchPopularMovies = async () => {
  const res = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`);

  if (!res.ok) {
    throw new Error('Failed to fetch popular movies');
  }

  const data = await res.json();

  return (data.results || []).map((item: RawMediaItem) => formatMedia(item));
};

export const fetchUpcomingMovies = async () => {
  const res = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}`);

  if (!res.ok) {
    throw new Error('Failed to fetch upcoming movies');
  }

  const data = await res.json();

  return (data.results || []).map((item: RawMediaItem) => formatMedia(item));
};

export const fetchTopRatedMovies = async () => {
  const res = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}`);

  if (!res.ok) {
    throw new Error('Failed to fetch top rated movies');
  }

  const data = await res.json();

  return (data.results || []).map((item: RawMediaItem) => formatMedia(item));
};

// Fetch Top 250 Movies by fetching pages 1 to 13 (20 items per page = 260 movies)
export const fetchTop250Movies = async () => {
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  const promises = pages.map((page) =>
    fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`).then((r) => r.json()),
  );

  const results = await Promise.all(promises);

  const allMovies = results.flatMap((r) => r.results || []);

  return allMovies.slice(0, 250).map((item: RawMediaItem) => formatMedia(item));
};

export const fetchPopularPeople = async (department?: 'Directing' | 'Acting'): Promise<PersonDetails[]> => {
  const pages = [1, 2, 3];

  const promises = pages.map((page) =>
    fetch(`${TMDB_BASE_URL}/person/popular?api_key=${API_KEY}&page=${page}`).then((r) => r.json()),
  );

  const results = await Promise.all(promises);

  let people: PersonDetails[] = results.flatMap((r) => r.results || []);

  if (department) {
    people = people.filter((p) => p.known_for_department === department);
  }

  return people;
};

export const fetchPersonDetails = async (id: number): Promise<PersonDetails> => {
  const res = await fetch(`${TMDB_BASE_URL}/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits`);

  if (!res.ok) {
    throw new Error('Failed to fetch person details');
  }

  return await res.json();
};

export const fetchCollectionDetails = async (id: number): Promise<CollectionPart[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/collection/${id}?api_key=${API_KEY}`);

  if (!res.ok) {
    throw new Error('Failed to fetch collection details');
  }

  const data = await res.json();

  return data.parts || [];
};

export const fetchGenres = async (mediaType: 'movie' | 'tv' = 'movie'): Promise<Genre[]> => {
  const res = await fetch(`${TMDB_BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`);

  if (!res.ok) {
    throw new Error('Failed to fetch genres');
  }

  const data = await res.json();

  return data.genres;
};

export const discoverMedia = async (params: {
  mediaType?: 'movie' | 'tv';
  genreId?: string;
  year?: string;
  minRating?: string;
  language?: string;
  country?: string;
  query?: string;
  page?: number;
  random?: boolean;
}) => {
  const type = params.mediaType || 'movie';

  let targetPage = params.page || 1;

  if (params.random) {
    targetPage = Math.floor(Math.random() * 20) + 1;
  }

  let url = `${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&page=${targetPage}&sort_by=popularity.desc`;

  if (params.genreId) {
    url += `&with_genres=${params.genreId}`;
  }

  if (params.year) {
    url += type === 'movie' ? `&primary_release_year=${params.year}` : `&first_air_date_year=${params.year}`;
  }

  if (params.minRating) {
    url += `&vote_average.gte=${params.minRating}`;
  }

  if (params.language) {
    url += `&with_original_language=${params.language}`;
  }

  if (params.country) {
    url += `&with_origin_country=${params.country}`;
  }

  if (params.query && params.query.trim()) {
    url = `${TMDB_BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(params.query.trim())}&page=${targetPage}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to discover media');
  }

  const data = await res.json();

  return {
    results: (data.results || []).map((item: RawMediaItem) => formatMedia(item, type)),
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
};

export const fetchMovieDetails = async (id: string, mediaType: 'movie' | 'tv' = 'movie'): Promise<MovieDetails> => {
  const res = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=credits,videos,watch/providers`);

  if (!res.ok) {
    throw new Error('Failed to fetch details');
  }

  return await res.json();
};
