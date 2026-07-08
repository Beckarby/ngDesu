import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonChip, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { AnimeCardComponent } from '../anime-card/anime-card.component';

interface Anime {
  id: number;
  name: string;
  category: string;
  date: string;
  userScore: number;
  criticScore: number;
  image?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonChip, IonSegment, IonSegmentButton, IonLabel, AnimeCardComponent]
})
export class searchPage {
  searchTerm = '';
  selectedCategory = 'All';
  sortBy: 'score' | 'date' = 'score';

  categories = ['All', 'Action', 'Sci-Fi', 'Romance', 'Slice of Life', 'Fantasy'];

  allAnime: Anime[] = [
    { id: 1, name: 'Cowboy Bebop', category: 'Sci-Fi', date: '1998-04-03', userScore: 9.2, criticScore: 9.5 },
    { id: 2, name: 'Neon Genesis Evangelion', category: 'Sci-Fi', date: '1995-10-04', userScore: 8.7, criticScore: 9.1 },
    { id: 3, name: 'Attack on Titan', category: 'Action', date: '2013-04-07', userScore: 9.0, criticScore: 8.9 },
    { id: 4, name: 'Fullmetal Alchemist', category: 'Action', date: '2009-04-05', userScore: 9.3, criticScore: 9.6 },
    { id: 5, name: 'Your Lie in April', category: 'Romance', date: '2014-10-10', userScore: 8.8, criticScore: 8.6 },
    { id: 6, name: 'Kaguya-sama: Love Is War', category: 'Romance', date: '2019-01-12', userScore: 8.5, criticScore: 8.3 },
    { id: 7, name: 'Barakamon', category: 'Slice of Life', date: '2014-07-06', userScore: 8.4, criticScore: 8.2 },
    { id: 8, name: 'Frieren: Beyond Journey\'s End', category: 'Fantasy', date: '2023-09-29', userScore: 9.1, criticScore: 9.4 },
    { id: 9, name: 'Steins;Gate', category: 'Sci-Fi', date: '2011-04-06', userScore: 9.0, criticScore: 9.2 },
    { id: 10, name: 'Demon Slayer', category: 'Action', date: '2019-04-06', userScore: 8.6, criticScore: 8.4 },
  ];

  get filteredAnime(): Anime[] {
    let list = this.allAnime;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(term));
    }

    if (this.selectedCategory !== 'All') {
      list = list.filter(a => a.category === this.selectedCategory);
    }

    if (this.sortBy === 'score') {
      list = [...list].sort((a, b) => (b.userScore + b.criticScore) / 2 - (a.userScore + a.criticScore) / 2);
    } else {
      list = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return list;
  }

  constructor() {}
}
