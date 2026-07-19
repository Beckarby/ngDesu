import api from './api';

// ----- Shared types -----

export interface MediaTitle {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
}

export interface MediaCoverImage {
  large: string;
  medium: string;
}

export interface MediaDate {
  year: number;
  month: number;
  day: number;
}

export interface Media {
  id: number;
  title: MediaTitle;
  coverImage: MediaCoverImage;
  description: string;
  episodes: number;
  averageScore: number; // 0-100 from AniList
  genres: string[];
  format: string;
  status: string;
  startDate: MediaDate;
  endDate: MediaDate;
  siteUrl: string;
}

export interface PageInfo {
  total: number;
  currentPage: number;
  hasNextPage: boolean;
  lastPage: number;
}

export interface MediaPage {
  pageInfo: PageInfo;
  media: Media[];
}

export interface ToProcessResponse<T> {
  message: string;
  output: T;
}

// ----- SearchAnime (tx 21) -----

export type SearchSort =
  | 'STATUS'
  | 'SCORE'
  | 'DATE'
  | 'TRENDING'
  | 'POPULARITY'
  | 'TITLE'
  | string;

export interface SearchAnimeArgs {
  searchText?: string;
  page?: string;
  perPage?: string;
  sort?: SearchSort;
  genre?: string; // '' for all
}

export type SearchAnimeResponse = ToProcessResponse<MediaPage>;

// ----- getAnimeById (tx 22) -----

export interface GetAnimeByIdArgs {
  animeId: string; // backend expects a string per the spec
}

export type GetAnimeByIdResponse = ToProcessResponse<Media>;

// ----- Ratings (tx 11-14) -----
// Backend pairs the rating with the comment in a single payload.

export interface AddRatingArgs {
  animeId: number;
  rating: number; // 0-100 (AniList averageScore convention)
  comment: string;
}

export interface GetRatingArgs {
  animeId: number;
}

export interface DeleteRatingArgs {
  animeId: number;
}

export interface UpdateRatingArgs {
  animeId: number;
  rating: number; // 0-100
  comment: string;
}

/**
 * Frontend-synthesized single-rating view reconstructed from the
 * backend's per-profile aggregate (tx 12). Used by the anime-detail
 * page to know "is there a rating to update vs add?".
 */
export interface RatingEntry {
  id: number;
  animeId: number;
  rating: number; // 0-100
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Raw row returned by the backend's `getRating` (tx 12).
 * It's a per-profile aggregate: the array is grouped by `fk_profile_id`.
 * `total_ratings` and `avg_score` are returned as **strings** (PostgreSQL NUMERIC).
 */
export interface RatingAggregateRow {
  fk_profile_id: number;
  total_ratings: number;
  avg_score: number;
  comments: string[] | null;
}

// ----- Watch status (tx 31) -----
// 1=to_watch, 2=watching, 3=dropped, 4=completed, 5=fav
export const WATCH_STATUS_VALUE = {
  to_watch: 1,
  watching: 2,
  dropped: 3,
  completed: 4,
  fav: 5,
} as const;

export type WatchStatusKey = keyof typeof WATCH_STATUS_VALUE;
export type WatchStatusValue = (typeof WATCH_STATUS_VALUE)[WatchStatusKey];

export interface AddStatusArgs {
  animeId: number;
  status: WatchStatusValue;
}

/**
 * tx 32 is "list all statuses for the current user" — no args.
 * Response is an array of `{ status, anime_id }` (note snake_case from backend).
 */
export type GetStatusArgs = Record<string, never>;

export interface UpdateStatusArgs {
  animeId: number;
  status: WatchStatusValue;
}

export interface DeleteStatusArgs {
  animeId: number;
}

export interface StatusListItem {
  status: WatchStatusValue;
  anime_id: number; // snake_case as returned by the backend
}

// ----- Service -----

export const toProcessService = {
  async toProcess<T = unknown>(tx: number, params?: unknown): Promise<T> {
    try {
      return await api.post<T>('/toProcess', { tx, params });
    } catch (error) {
      console.error('toProcess error:', error);
      throw error;
    }
  },

  // Anime search & detail (tx 21, 22)
  async searchAnime<T = SearchAnimeResponse>(args: SearchAnimeArgs): Promise<T> {
    return this.toProcess<T>(21, [args]);
  },
  async getAnimeById<T = GetAnimeByIdResponse>(args: GetAnimeByIdArgs): Promise<T> {
    return this.toProcess<T>(22, [args]);
  },

  // Ratings + comment (tx 11-14)
  async addRating<T = ToProcessResponse<string>>(args: AddRatingArgs): Promise<T> {
    return this.toProcess<T>(11, [args]);
  },
  async getRating<T = ToProcessResponse<RatingAggregateRow[]>>(args: GetRatingArgs): Promise<T> {
    return this.toProcess<T>(12, [args]);
  },
  async deleteRating<T = ToProcessResponse<{ message?: string }>>(args: DeleteRatingArgs): Promise<T> {
    return this.toProcess<T>(13, [args]);
  },
  async updateRating<T = ToProcessResponse<string>>(args: UpdateRatingArgs): Promise<T> {
    return this.toProcess<T>(14, [args]);
  },

  // Watch status (tx 31-34)
  async addStatus<T = ToProcessResponse<string>>(args: AddStatusArgs): Promise<T> {
    return this.toProcess<T>(31, [args]);
  },
  async getStatus<T = ToProcessResponse<StatusListItem[]>>(args: GetStatusArgs = {}): Promise<T> {
    return this.toProcess<T>(32, [args]);
  },
  async updateStatus<T = ToProcessResponse<string>>(args: UpdateStatusArgs): Promise<T> {
    return this.toProcess<T>(34, [args]);
  },
  async deleteStatus<T = ToProcessResponse<{ message?: string }>>(args: DeleteStatusArgs): Promise<T> {
    return this.toProcess<T>(33, [args]);
  },

  /** Convert a 1-5 star rating (UI) to the 0-100 AniList convention (backend). */
  starsToScore100(stars: number): number {
    const clamped = Math.max(1, Math.min(5, Math.round(stars)));
    return Math.round(clamped * 20);
  },

  /** Convert a 0-100 AniList score (backend) to a 1-5 star rating (UI). */
  score100ToStars(score: number): number {
    if (!score) return 0;
    return Math.max(1, Math.min(5, Math.round(score / 20)));
  },
};
