import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.component.html',
  styleUrls: ['./anime-card.component.scss'],
  imports: [RouterLink],
})
export class AnimeCardComponent {
  @Input() anime?: { id: number; name: string; image?: string; userScore?: number; criticScore?: number };
}
