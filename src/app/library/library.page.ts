import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';
import { AnimeCardComponent } from '../anime-card/anime-card.component';
import { ReviewCardComponent } from '../review-card/review-card.component';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonIcon, IonLabel, AnimeCardComponent, ReviewCardComponent],
})
export class libraryPage {
  selectedSegment = 'completed';

  completedAnime = [
    { id: 1, name: 'Cowboy Bebop' },
    { id: 2, name: 'Ghost in the Shell' },
    { id: 3, name: 'Neon Genesis Evangelion' },
  ];

  reviews = [
    { id: 1, animeName: 'Cowboy Bebop', rating: 9, review: 'A masterpiece of animation with incredible jazz soundtrack and deep characters.' },
    { id: 2, animeName: 'Ghost in the Shell', rating: 8, review: 'Philosophical cyberpunk classic that redefined the genre. Must watch!' },
  ];

  constructor() {
    addIcons({
      'checkmark-circle-outline': checkmarkCircleOutline,
      'chatbubble-ellipses-outline': chatbubbleEllipsesOutline,
    });
  }
}
