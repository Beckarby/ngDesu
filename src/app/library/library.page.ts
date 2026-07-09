import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonIcon, IonLabel, IonModal, IonTextarea, IonButtons, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, chatbubbleEllipsesOutline, star, starOutline, close } from 'ionicons/icons';
import { AnimeCardComponent } from '../anime-card/anime-card.component';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { AnimeStore } from '../store/anime-store.service';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonIcon, IonLabel, AnimeCardComponent, ReviewCardComponent, IonModal, IonTextarea, IonButtons, IonButton],
})
export class libraryPage {
  @ViewChild('editModal') modal!: IonModal;
  protected store = inject(AnimeStore);

  selectedSegment = 'completed';

  editingReviewId: number | null = null;
  editRating = 0;
  editText = '';

  get reviews() { return this.store.reviews(); }
  get completedAnime() { return this.store.completedAnime(); }

  constructor() {
    addIcons({
      'checkmark-circle-outline': checkmarkCircleOutline,
      'chatbubble-ellipses-outline': chatbubbleEllipsesOutline,
      'star': star,
      'star-outline': starOutline,
      'close': close,
    });
  }

  openEditReview(review: typeof this.reviews[0]) {
    this.editingReviewId = review.id;
    this.editRating = review.rating;
    this.editText = review.review;
    this.modal.present();
  }

  saveReview() {
    if (this.editingReviewId === null) return;
    this.store.updateReview(this.editingReviewId, { rating: this.editRating, review: this.editText });
    this.modal.dismiss();
  }

  deleteReview(review: typeof this.reviews[0]) {
    this.store.deleteReview(review.id);
  }

  closeEditModal() {
    this.modal.dismiss();
  }
}
