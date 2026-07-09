import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TopAnimeCardComponent } from '../top-anime-card/top-anime-card.component';
import { AnimeStore } from '../store/anime-store.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, TopAnimeCardComponent],
})
export class homePage {
  protected store = inject(AnimeStore);

  constructor() {}
}
