import { Component, OnInit, inject, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { TopAnimeCardComponent } from '../top-anime-card/top-anime-card.component';
import { toProcessService, Media } from '../services/toProcess';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, TopAnimeCardComponent, IonSpinner],
})
export class homePage implements OnInit {
  topAnime = signal<{ id: number; title: string; image?: string; description: string; score: number }[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await toProcessService.searchAnime({
        searchText: '',
        page: '1',
        perPage: '6',
        sort: 'TRENDING',
        genre: '',
      });
      this.topAnime.set(res.output.media.map(m => this.toCard(m)));
      console.log('[home] ranking', this.topAnime().map(a => ({ title: a.title, score: a.score })));
    } catch (err) {
      console.error('home fetch failed', err);
      this.topAnime.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private toCard(m: Media) {
    return {
      id: m.id,
      title: m.title.userPreferred || m.title.english || m.title.romaji,
      image: m.coverImage.large,
      description: m.description,
      score: toProcessService.score100ToStars(m.averageScore),
    };
  }
}
