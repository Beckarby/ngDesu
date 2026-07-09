import { Component, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonLabel, IonInput, IonText, IonRouterLink, IonModal, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, pencilOutline, personCircleOutline, close } from 'ionicons/icons';
import { ProfileStore } from '../store/profile-store.service';

function letterRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value?.toString() ?? '';
  return /[a-zA-Z]/.test(val.trim()) ? null : { letterRequired: true };
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonLabel, IonInput, IonText, IonRouterLink, IonModal, IonGrid, IonRow, IonCol],
})
export class editProfilePage {
  @ViewChild('avatarModal') modal!: IonModal;

  form = new FormGroup({
    nickname: new FormControl('', [Validators.required, letterRequiredValidator]),
  });

  avatars = Array.from({ length: 10 }, (_, i) => `assets/profile/image${i + 1}.jpg`);
  currentAvatar: string | null = null;

  private router = inject(Router);
  private profileStore = inject(ProfileStore);

  constructor() {
    addIcons({
      'person-outline': personOutline,
      'pencil-outline': pencilOutline,
      'person-circle-outline': personCircleOutline,
      'close': close,
    });
  }

  openModal() {
    this.modal.present();
  }

  selectAvatar(img: string) {
    this.currentAvatar = img;
    this.profileStore.currentAvatar.set(img);
    this.modal.dismiss();
  }

  closeModal() {
    this.modal.dismiss();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const nickname = this.form.value.nickname ?? null;
    this.profileStore.nickname.set(nickname);
    console.log('Edit Profile:', { nickname, avatar: this.currentAvatar });
  }
}
