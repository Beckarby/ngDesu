import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.component.html',
  styleUrls: ['./anime-card.component.scss'],
})
export class AnimeCardComponent {
  @Input() anime?: { id: number; name: string; image?: string };
}
