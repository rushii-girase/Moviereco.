// Backend API client for auth, watchlist, ratings, and custom lists

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

function getToken(): string | null {
  const auth = localStorage.getItem('auth');

  if (auth) {
    try {
      return JSON.parse(auth).token;
    } catch {
      return null;
    }
  }

  return null;
}

function authHeaders(): HeadersInit {
  const token = getToken();

  if (token) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  return {
    'Content-Type': 'application/json',
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));

    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────
export interface AuthUser {
  token: string;
  userId: number;
  name: string;
  email: string;
}

export const registerUser = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse<AuthUser>(res);
};

export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse<AuthUser>(res);
};

export const fetchCurrentUser = async () => {
  const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });

  return handleResponse(res);
};

// ─── Watchlist ───────────────────────────────────────
export interface WatchlistItemData {
  id: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseYear: number | null;
  rating: number | null;
  mediaType: string;
}

export const fetchServerWatchlist = async (): Promise<WatchlistItemData[]> => {
  const res = await fetch(`${API_BASE}/watchlist`, { headers: authHeaders() });

  return handleResponse<WatchlistItemData[]>(res);
};

export const addToServerWatchlist = async (item: {
  tmdbId: number;
  title: string;
  posterPath?: string;
  releaseYear?: number;
  rating?: number;
  mediaType?: string;
}) => {
  const res = await fetch(`${API_BASE}/watchlist`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item),
  });

  return handleResponse(res);
};

export const removeFromServerWatchlist = async (tmdbId: number, mediaType = 'movie') => {
  const res = await fetch(`${API_BASE}/watchlist/${tmdbId}?mediaType=${mediaType}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  return handleResponse(res);
};

export const checkInWatchlist = async (tmdbId: number, mediaType = 'movie') => {
  const res = await fetch(`${API_BASE}/watchlist/check/${tmdbId}?mediaType=${mediaType}`, {
    headers: authHeaders(),
  });

  return handleResponse<{ inWatchlist: boolean }>(res);
};

// ─── Ratings ─────────────────────────────────────────
export interface RatingData {
  tmdbId: number;
  mediaType?: string;
  cinematography?: number;
  acting?: number;
  story?: number;
  soundtrack?: number;
  overall: number;
  reviewText?: string;
}

export const submitRating = async (rating: RatingData) => {
  const res = await fetch(`${API_BASE}/ratings`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(rating),
  });

  return handleResponse(res);
};

export const fetchUserRatings = async () => {
  const res = await fetch(`${API_BASE}/ratings`, { headers: authHeaders() });

  return handleResponse(res);
};

export const fetchMovieRating = async (
  tmdbId: number,
  mediaType = 'movie',
): Promise<RatingData | null> => {
  const res = await fetch(`${API_BASE}/ratings/${tmdbId}?mediaType=${mediaType}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    return null;
  }

  return handleResponse<RatingData>(res);
};

// ─── Custom Lists ────────────────────────────────────
export interface CustomListData {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  shareCode: string;
  items: { id: number; tmdbId: number; title: string; posterPath: string | null; mediaType: string }[];
}

export const fetchUserLists = async (): Promise<CustomListData[]> => {
  const res = await fetch(`${API_BASE}/lists`, { headers: authHeaders() });

  return handleResponse<CustomListData[]>(res);
};

export const createCustomList = async (name: string, description?: string, isPublic = false) => {
  const res = await fetch(`${API_BASE}/lists`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, description, isPublic }),
  });

  return handleResponse(res);
};

export const deleteCustomList = async (listId: number) => {
  const res = await fetch(`${API_BASE}/lists/${listId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  return handleResponse(res);
};

export const addToCustomList = async (listId: number, item: {
  tmdbId: number;
  title: string;
  mediaType?: string;
  posterPath?: string;
}) => {
  const res = await fetch(`${API_BASE}/lists/${listId}/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item),
  });

  return handleResponse(res);
};

export const removeFromCustomList = async (listId: number, tmdbId: number, mediaType = 'movie') => {
  const res = await fetch(`${API_BASE}/lists/${listId}/items/${tmdbId}?mediaType=${mediaType}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  return handleResponse(res);
};

export const fetchSharedList = async (shareCode: string): Promise<CustomListData> => {
  const res = await fetch(`${API_BASE}/lists/shared/${shareCode}`);

  return handleResponse<CustomListData>(res);
};
