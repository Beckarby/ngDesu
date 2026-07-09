import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
  imports: [IonIcon, IonButton],
})
export class ReviewCardComponent {
  @Input() review?: {
    id: number;
    animeName: string;
    animeImage?: string;
    rating: number;
    review: string;
  };

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor() {
    addIcons({ 'create-outline': createOutline, 'trash-outline': trashOutline });
  }
}
