import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonIcon, IonLabel, IonModal, IonTextarea, IonButtons, IonButton, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, chatbubbleEllipsesOutline, star, starOutline, close, bookmarkOutline, eyeOutline, closeCircleOutline, heartOutline } from 'ionicons/icons';
import { AnimeCardComponent } from '../anime-card/anime-card.component';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { AnimeStore, WATCH_STATUSES, WatchStatus, Review } from '../store/anime-store.service';
import { toProcessService } from '../services/toProcess';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonIcon, IonLabel, AnimeCardComponent, ReviewCardComponent, IonModal, IonTextarea, IonButtons, IonButton, IonSpinner, IonToast],
})
export class libraryPage implements OnInit {
  @ViewChild('editModal') modal!: IonModal;
  protected store = inject(AnimeStore);

  selectedSegment: WatchStatus | 'reviews' = 'reviews';

  editingReview: Review | null = null;
  editRating = 0;
  editText = '';

  loading = signal(true);

  toastMessage = '';
  toastOpen = false;
  toastColor: 'success' | 'danger' = 'success';

  readonly watchStatuses = WATCH_STATUSES;

  get reviews() { return this.store.reviews(); }
  animeForSegment() { return this.store.getAnimeByStatus(this.selectedSegment as WatchStatus); }

  constructor() {
    addIcons({
      'checkmark-circle-outline': checkmarkCircleOutline,
      'chatbubble-ellipses-outline': chatbubbleEllipsesOutline,
      'star': star,
      'star-outline': starOutline,
      'close': close,
      'bookmark-outline': bookmarkOutline,
      'eye-outline': eyeOutline,
      'close-circle-outline': closeCircleOutline,
      'heart-outline': heartOutline,
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      await this.store.refreshLibrary();
    } catch (err) {
      console.error('library refresh failed', err);
      this.showToast('Failed to load library', 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  openEditReview(review: Review) {
    console.log('[click] library openEditReview', { animeId: review.animeId, reviewId: review.id });
    this.editingReview = review;
    this.editRating = review.rating;
    this.editText = review.review;
    this.modal.present();
  }

  async saveReview() {
    console.log('[click] library saveReview', { animeId: this.editingReview?.animeId, rating: this.editRating });
    if (!this.editingReview) return;
    const review = this.editingReview;
    const score0to100 = toProcessService.starsToScore100(this.editRating);
    const comment = this.editText;
    try {
      const res = await toProcessService.updateRating({ animeId: review.animeId, rating: score0to100, comment });
      console.log('[backend] updateRating response', res);
      this.store.updateReview(review.id, { rating: this.editRating, review: this.editText });
      this.modal.dismiss();
      this.showToast('Review updated', 'success');
    } catch (err: any) {
      console.error('updateRating failed', err);
      this.showToast(err?.response?.data?.message ?? 'Failed to save', 'danger');
    }
  }

  async deleteReview(review: Review) {
    console.log('[click] library deleteReview', { animeId: review.animeId, reviewId: review.id });
    try {
      const res = await toProcessService.deleteRating({ animeId: review.animeId });
      console.log('[backend] deleteRating response', res);
      this.store.deleteReview(review.id);
      this.showToast('Review deleted', 'success');
    } catch (err: any) {
      console.error('deleteRating failed', err);
      this.showToast(err?.response?.data?.message ?? 'Failed to delete', 'danger');
    }
  }

  closeEditModal() {
    console.log('[click] library closeEditModal');
    this.modal.dismiss();
  }

  private showToast(msg: string, color: 'success' | 'danger') {
    this.toastMessage = msg;
    this.toastColor = color;
    this.toastOpen = true;
  }
}
