import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonCard } from '@ionic/angular/standalone';

@Component({
  selector: 'app-top-anime-card',
  templateUrl: './top-anime-card.component.html',
  styleUrls: ['./top-anime-card.component.scss'],
  imports: [IonCard, RouterLink],
})
export class TopAnimeCardComponent {
  @Input() anime?: { id: number; title: string; image?: string; description: string; score: number };
}
