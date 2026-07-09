import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonChip, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { AnimeCardComponent } from '../anime-card/anime-card.component';
import { AnimeStore } from '../store/anime-store.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonChip, IonSegment, IonSegmentButton, IonLabel, AnimeCardComponent]
})
export class searchPage {
  private store = inject(AnimeStore);

  searchTerm = '';
  selectedCategory = 'All';
  sortBy: 'score' | 'date' = 'score';

  get categories() { return this.store.categories(); }
  get filteredAnime() { return this.store.getFilteredAnime(this.searchTerm, this.selectedCategory, this.sortBy); }
}
