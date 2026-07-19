import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonList, IonItem, IonLabel, NavController } from '@ionic/angular/standalone';
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
  private navController = inject(NavController);
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
    console.log('[nav] signOut -> navigateRoot /login');
    await this.navController.navigateRoot('/login', { animated: false });
    console.log('[nav] signOut navigateRoot completed', { url: location.hash });
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
