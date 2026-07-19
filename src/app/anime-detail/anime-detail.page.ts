import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonTextarea, IonIcon, IonPopover, IonList, IonItem, IonLabel, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline, checkmarkOutline, ellipsisVertical, bookmarkOutline, eyeOutline, closeCircleOutline, checkmarkCircleOutline, heartOutline } from 'ionicons/icons';
import { AnimeStore, WATCH_STATUSES, WatchStatus } from '../store/anime-store.service';
import { authService } from '../services/auth';
import { toProcessService, Media, RatingEntry, RatingAggregateRow, ToProcessResponse, WATCH_STATUS_VALUE, WatchStatusValue } from '../services/toProcess';

interface AnimeDetailView {
  id: number;
  title: string;
  image?: string;
  userScore: number;
  criticScore: number;
  releaseDate: string;
  genres: string[];
  synopsis: string;
}

@Component({
  selector: 'app-anime-detail',
  templateUrl: 'anime-detail.page.html',
  styleUrls: ['anime-detail.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonTextarea, IonIcon, IonPopover, IonList, IonItem, IonLabel, IonSpinner, IonToast],
})
export class AnimeDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  protected store = inject(AnimeStore);

  animeId!: number;
  detail = signal<AnimeDetailView | null>(null);
  loading = signal(true);
  userRating = 0;
  reviewText = '';
  isStatusMenuOpen = false;

  private existingRating: RatingEntry | null = null;

  toastMessage = '';
  toastOpen = false;
  toastColor: 'success' | 'danger' = 'success';

  readonly watchStatuses = WATCH_STATUSES;
  get communityReviews() { return this.store.communityReviews(); }
  get currentStatus() { return this.store.getAnimeStatus(this.animeId); }

  constructor() {
    addIcons({ star, starOutline, checkmarkOutline, 'ellipsis-vertical': ellipsisVertical, 'bookmark-outline': bookmarkOutline, 'eye-outline': eyeOutline, 'close-circle-outline': closeCircleOutline, 'checkmark-circle-outline': checkmarkCircleOutline, 'heart-outline': heartOutline });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.animeId = id;
      this.existingRating = null;
      this.userRating = 0;
      this.reviewText = '';
      this.loadDetail();
      this.loadExistingRating();
    });
  }

  private async loadDetail() {
    this.loading.set(true);
    try {
      const res = await toProcessService.getAnimeById<{ message: string; output: Media }>({
        animeId: String(this.animeId),
      });
      this.detail.set(this.toView(res.output));
    } catch (err) {
      console.error('getAnimeById failed', err);
      this.detail.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadExistingRating() {
    try {
      // Backend's getRating returns a per-profile aggregate (grouped by fk_profile_id).
      // We need to know the current user's profile to pick the right row.
      // The backend endpoint no longer exists, so fall back to the local cache only.
      const profile = 1;

      const res = await toProcessService.getRating<ToProcessResponse<RatingAggregateRow[]>>({
        animeId: this.animeId,
      });
      // Find the row for the current user's profile; if missing, fall back to any row with data.
      const row = res.output?.find(r => r.fk_profile_id === profile) ??
                  res.output?.find(r => Number(r.total_ratings) > 0);
      if (row && Number(row.total_ratings) > 0) {
        const avgScore = Number(row.avg_score);
        this.existingRating = {
          id: row.fk_profile_id, // synthetic id (we don't have a real one)
          animeId: this.animeId,
          rating: avgScore,
          comment: row.comments?.[0] ?? '',
        };
        this.userRating = toProcessService.score100ToStars(avgScore);
        this.reviewText = row.comments?.[0] ?? '';
      }
    } catch (err) {
      // Non-fatal: user just hasn't rated yet
      console.debug('No existing rating', err);
    }
  }

  private toView(m: Media): AnimeDetailView {
    const d = m.startDate;
    const releaseDate = d?.year ? `${d.year}-${String(d.month ?? 1).padStart(2, '0')}-${String(d.day ?? 1).padStart(2, '0')}` : '';
    return {
      id: m.id,
      title: m.title.userPreferred || m.title.english || m.title.romaji,
      image: m.coverImage.large,
      userScore: toProcessService.score100ToStars(m.averageScore),
      criticScore: 0,
      releaseDate,
      genres: m.genres,
      synopsis: m.description,
    };
  }

  async setRating(star: number) {
    console.log('[click] anime-detail setRating', { animeId: this.animeId, star });
    this.userRating = star;
    try {
      const score0to100 = toProcessService.starsToScore100(star);
      const comment = this.reviewText ?? '';
      if (this.existingRating) {
        const res = await toProcessService.updateRating({ animeId: this.animeId, rating: score0to100, comment });
        console.log('[backend] updateRating response', res);
      } else {
        const res = await toProcessService.addRating({ animeId: this.animeId, rating: score0to100, comment });
        console.log('[backend] addRating response', res);
        // refresh existing so subsequent calls route through updateRating
        this.loadExistingRating();
      }
    } catch (err) {
      console.error('setRating failed', err);
    }
  }

  openStatusMenu() {
    console.log('[click] anime-detail openStatusMenu', { animeId: this.animeId });
    this.isStatusMenuOpen = true;
  }

  async selectStatus(status: WatchStatus) {
    console.log('[click] anime-detail selectStatus', { animeId: this.animeId, status });
    const intStatus = WATCH_STATUS_VALUE[status] as WatchStatusValue;
    this.store.setAnimeStatus(this.animeId, status);
    this.isStatusMenuOpen = false;
    try {
      // tx 32 = list all my statuses. Find whether this anime already has one.
      const all = await toProcessService.getStatus();
      console.log('[backend] getStatus response', all);
      const existing = all.output.find(s => Number(s.anime_id) === this.animeId);
      if (existing) {
        const res = await toProcessService.updateStatus({ animeId: this.animeId, status: intStatus });
        console.log('[backend] updateStatus response', res);
      } else {
        const res = await toProcessService.addStatus({ animeId: this.animeId, status: intStatus });
        console.log('[backend] addStatus response', res);
      }
    } catch (err) {
      console.error('selectStatus failed', err);
      this.showToast('Failed to update status', 'danger');
    }
  }

  statusLabel(status: WatchStatus | null): string {
    if (!status) return 'Add to List';
    return WATCH_STATUSES.find(s => s.value === status)?.label ?? 'Add to List';
  }

  async postReview() {
    console.log('[click] anime-detail postReview', { animeId: this.animeId, rating: this.userRating });
    if (!this.userRating) {
      this.showToast('Please select a star rating first', 'danger');
      return;
    }
    try {
      const score0to100 = toProcessService.starsToScore100(this.userRating);
      const comment = this.reviewText ?? '';
      if (this.existingRating) {
        const res = await toProcessService.updateRating({ animeId: this.animeId, rating: score0to100, comment });
        console.log('[backend] updateRating response', res);
      } else {
        const res = await toProcessService.addRating({ animeId: this.animeId, rating: score0to100, comment });
        console.log('[backend] addRating response', res);
        this.loadExistingRating();
      }
      this.showToast('Review posted', 'success');
    } catch (err: any) {
      console.error('postReview failed', err);
      this.showToast(err?.response?.data?.message ?? 'Failed to post review', 'danger');
    }
  }

  private showToast(msg: string, color: 'success' | 'danger') {
    this.toastMessage = msg;
    this.toastColor = color;
    this.toastOpen = true;
  }
}
