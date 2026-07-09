import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, chatbubbleOutline, chevronForward, personOutline, logOutOutline, starOutline, tvOutline } from 'ionicons/icons';
import { HeaderComponent } from '../header/header.component';
import { ProfileStore } from '../store/profile-store.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [RouterLink, IonContent, IonIcon, IonList, IonItem, IonLabel, HeaderComponent],
})
export class profilePage {
  private router = inject(Router);
  protected profileStore = inject(ProfileStore);

  signOut() {
    this.profileStore.currentAvatar.set(null);
    this.profileStore.nickname.set(null);
    this.router.navigateByUrl('/login');
  }

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
