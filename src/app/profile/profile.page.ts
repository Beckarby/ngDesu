import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonList, IonItem, IonLabel, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, chatbubbleOutline, chevronForward, personOutline, logOutOutline, starOutline, tvOutline } from 'ionicons/icons';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [RouterLink, IonContent, IonIcon, IonList, IonItem, IonLabel, IonAvatar, HeaderComponent],
})
export class profilePage {
  constructor() {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'tv-outline': tvOutline,
      'chatbubble-outline': chatbubbleOutline,
      'chevron-forward': chevronForward,
      'person-outline': personOutline,
      'log-out-outline': logOutOutline,
      'star-outline': starOutline,
    });
  }
}
