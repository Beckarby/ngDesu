import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, chatbubbleOutline, chevronForward, personOutline, logOutOutline, starOutline, tvOutline } from 'ionicons/icons';
import { HeaderComponent } from '../header/header.component';
import { ProfileStore } from '../store/profile-store.service';
import { authService } from '../services/auth';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  imports: [RouterLink, IonContent, IonIcon, IonList, IonItem, IonLabel, HeaderComponent],
})
export class profilePage implements OnInit {
  private router = inject(Router);
  protected profileStore = inject(ProfileStore);

  async signOut() {
    console.log('[click] profile signOut');
    try {
      const res = await authService.logout();
      console.log('[backend] logout response', res);
    } catch (err) {
      console.error('Logout failed:', err);
    }
    this.profileStore.clear();
    await this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    this.profileStore.loadFromCache();
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
