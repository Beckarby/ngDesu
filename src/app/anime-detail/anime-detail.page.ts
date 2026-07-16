import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonTextarea, IonIcon, IonPopover, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline, checkmarkOutline, ellipsisVertical, bookmarkOutline, eyeOutline, closeCircleOutline, checkmarkCircleOutline, heartOutline } from 'ionicons/icons';
import { AnimeStore, WATCH_STATUSES, WatchStatus } from '../store/anime-store.service';

@Component({
  selector: 'app-anime-detail',
  templateUrl: 'anime-detail.page.html',
  styleUrls: ['anime-detail.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonTextarea, IonIcon, IonPopover, IonList, IonItem, IonLabel],
})
export class AnimeDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  protected store = inject(AnimeStore);

  animeId!: number;
  userRating = 0;
  reviewText = '';
  isStatusMenuOpen = false;

  readonly watchStatuses = WATCH_STATUSES;

  get detail() { return this.store.getAnimeById(this.animeId); }
  get communityReviews() { return this.store.communityReviews(); }
  get currentStatus() { return this.store.getAnimeStatus(this.animeId); }

  constructor() {
    addIcons({ star, starOutline, checkmarkOutline, 'ellipsis-vertical': ellipsisVertical, 'bookmark-outline': bookmarkOutline, 'eye-outline': eyeOutline, 'close-circle-outline': closeCircleOutline, 'checkmark-circle-outline': checkmarkCircleOutline, 'heart-outline': heartOutline });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.animeId = Number(params.get('id'));
    });
  }

  setRating(star: number) {
    this.userRating = star;
  }

  openStatusMenu() {
    this.isStatusMenuOpen = true;
  }

  selectStatus(status: WatchStatus) {
    this.store.setAnimeStatus(this.animeId, status);
    this.isStatusMenuOpen = false;
  }

  statusLabel(status: WatchStatus | null): string {
    if (!status) return 'Add to List';
    return WATCH_STATUSES.find(s => s.value === status)?.label ?? 'Add to List';
  }

  postReview() {
    console.log('Posting review:', { animeId: this.animeId, rating: this.userRating, review: this.reviewText });
  }
}
