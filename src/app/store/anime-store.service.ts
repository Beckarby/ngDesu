import { Injectable, signal } from '@angular/core';
import { toProcessService, Media, RatingAggregateRow, StatusListItem, ToProcessResponse, WATCH_STATUS_VALUE } from '../services/toProcess';

export interface Review {
  id: number;
  animeId: number;
  animeName: string;
  animeImage?: string;
  rating: number; // 1-5 stars (UI convention; backend stores 0-100)
  review: string;
}

export interface CommunityReview {
  id: number;
  username: string;
  rating: number;
  review: string;
}

export type WatchStatus = 'to_watch' | 'watching' | 'dropped' | 'completed' | 'fav';

export const WATCH_STATUSES: { value: WatchStatus; label: string; icon: string }[] = [
  { value: 'to_watch', label: 'To Watch', icon: 'bookmark-outline' },
  { value: 'watching', label: 'Watching', icon: 'eye-outline' },
  { value: 'dropped', label: 'Dropped', icon: 'close-circle-outline' },
  { value: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' },
  { value: 'fav', label: 'Favorites', icon: 'heart-outline' },
];

export interface LibraryEntry {
  id: number;
  title: string;
  status: WatchStatus;
}

const LIBRARY_KEY = 'ngdesu_library';
const REVIEWS_KEY = 'ngdesu_reviews';

@Injectable({ providedIn: 'root' })
export class AnimeStore {
  readonly reviews = signal<Review[]>(this.hydrateReviews());

  readonly communityReviews = signal<CommunityReview[]>([]);

  readonly libraryAnime = signal<LibraryEntry[]>(this.hydrateLibrary());

  readonly categories = signal<string[]>(['All', 'Action', 'Sci-Fi', 'Romance', 'Slice of Life', 'Fantasy']);

  addReview(review: Review) {
    this.reviews.update(r => {
      const next = [...r, review];
      this.persistReviews(next);
      return next;
    });
  }

  updateReview(id: number, changes: Partial<Review>) {
    this.reviews.update(r => {
      const next = r.map(rev => rev.id === id ? { ...rev, ...changes } : rev);
      this.persistReviews(next);
      return next;
    });
  }

  deleteReview(id: number) {
    this.reviews.update(r => {
      const next = r.filter(rev => rev.id !== id);
      this.persistReviews(next);
      return next;
    });
  }

  nextReviewId(): number {
    return Math.max(0, ...this.reviews().map(r => r.id)) + 1;
  }

  getAnimeStatus(id: number): WatchStatus | null {
    return this.libraryAnime().find(a => a.id === id)?.status ?? null;
  }

  getAnimeByStatus(status: WatchStatus): LibraryEntry[] {
    return this.libraryAnime().filter(a => a.status === status);
  }

  setAnimeStatus(id: number, status: WatchStatus) {
    this.libraryAnime.update(list => {
      const exists = list.find(a => a.id === id);
      const next = exists
        ? list.map(a => a.id === id ? { ...a, status } : a)
        : [...list, { id, title: `Anime #${id}`, status }];
      this.persistLibrary(next);
      return next;
    });
  }

  /**
   * Refreshes the user's library and reviews from the backend.
   * 1. Calls `getStatus()` (no args) to get the full list of `{ status, anime_id }` pairs.
   * 2. Calls `getAnimeById` for each entry (in parallel) to get the real title.
   * 3. Maps that into the local `libraryAnime` signal.
   * 4. For each anime, calls `getRating` to fetch the user's review and populates `reviews`.
   */
  async refreshLibrary(): Promise<void> {
    // 1. Fetch the user's full status list.
    let statusList: StatusListItem[] = [];
    try {
      const res = await toProcessService.getStatus<ToProcessResponse<StatusListItem[]>>();
      statusList = res.output ?? [];
    } catch (err) {
      console.error('getStatus failed', err);
      statusList = [];
    }

    // 2. Map into libraryAnime (status int -> WatchStatus string), and fetch titles in parallel.
    const statusIntToKey = (v: number) =>
      (Object.entries(WATCH_STATUS_VALUE) as [WatchStatus, number][])
        .find(([, val]) => val === v)?.[0] ?? 'to_watch';

    const titleResults = await Promise.all(
      statusList.map(async s => {
        try {
          return await toProcessService.getAnimeById<ToProcessResponse<Media>>({
            animeId: String(s.anime_id),
          });
        } catch {
          return null; // title lookup failed, use placeholder
        }
      })
    );

    const libraryEntries: LibraryEntry[] = statusList.map((s, i) => {
      const id = Number(s.anime_id);
      const r = titleResults[i];
      const title = r?.output?.title
        ? (r.output.title.userPreferred || r.output.title.english || r.output.title.romaji)
        : `Anime #${id}`;
      return { id, title, status: statusIntToKey(s.status) };
    });
    this.libraryAnime.set(libraryEntries);
    this.persistLibrary(libraryEntries);

    // 3. For each anime, fetch the review (rating + comment).
    const fetched: Review[] = [];
    let nextId = this.nextReviewId();
    for (const entry of libraryEntries) {
      try {
        const res = await toProcessService.getRating<ToProcessResponse<RatingAggregateRow[]>>({
          animeId: entry.id,
        });
        const row = res.output?.find(r => Number(r.total_ratings) > 0);
        if (row) {
          const avgScore = Number(row.avg_score);
          fetched.push({
            id: nextId++,
            animeId: entry.id,
            animeName: entry.title,
            rating: toProcessService.score100ToStars(avgScore),
            review: row.comments?.[0] ?? '',
          });
        }
      } catch (err) {
        console.debug('No rating for', entry.id, err);
      }
    }
    this.reviews.set(fetched);
    this.persistReviews(fetched);
  }

  private persistLibrary(list: LibraryEntry[]): void {
    try {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to persist library', err);
    }
  }

  private persistReviews(list: Review[]): void {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to persist reviews', err);
    }
  }

  private hydrateReviews(): Review[] {
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Review[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error('Failed to hydrate reviews', err);
    }
    return [];
  }

  private hydrateLibrary(): LibraryEntry[] {
    try {
      const raw = localStorage.getItem(LIBRARY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LibraryEntry[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error('Failed to hydrate library', err);
    }
    // First-run fallback (until "list user statuses" endpoint exists)
    return [
      { id: 1, title: 'Cowboy Bebop', status: 'completed' },
      { id: 11, title: 'Ghost in the Shell', status: 'fav' },
      { id: 6, title: 'Neon Genesis Evangelion', status: 'watching' },
    ];
  }
}
