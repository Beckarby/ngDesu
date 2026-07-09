import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonTextarea, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline, checkmarkOutline } from 'ionicons/icons';
import { AnimeStore } from '../store/anime-store.service';

@Component({
  selector: 'app-anime-detail',
  templateUrl: 'anime-detail.page.html',
  styleUrls: ['anime-detail.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonButton, IonTextarea, IonIcon],
})
export class AnimeDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  protected store = inject(AnimeStore);

  animeId!: number;
  userRating = 0;
  reviewText = '';

  get detail() { return this.store.getAnimeById(this.animeId); }
  get communityReviews() { return this.store.communityReviews(); }
  get isWatched() { return this.store.completedAnime().some(a => a.id === this.animeId); }

  constructor() {
    addIcons({ star, starOutline, checkmarkOutline });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.animeId = Number(params.get('id'));
    });
  }

  setRating(star: number) {
    this.userRating = star;
  }

  toggleWatched() {
    this.store.toggleCompleted(this.animeId);
  }

  postReview() {
    console.log('Posting review:', { animeId: this.animeId, rating: this.userRating, review: this.reviewText });
  }
}
