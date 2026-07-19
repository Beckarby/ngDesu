import { Component, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonLabel, IonInput, IonText, IonRouterLink, IonModal, IonGrid, IonRow, IonCol, IonToast, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, pencilOutline, personCircleOutline, close } from 'ionicons/icons';
import { ProfileStore } from '../store/profile-store.service';
import { authService } from '../services/auth';

function letterRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value?.toString() ?? '';
  return /[a-zA-Z]/.test(val.trim()) ? null : { letterRequired: true };
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonLabel, IonInput, IonText, IonRouterLink, IonModal, IonGrid, IonRow, IonCol, IonToast, IonSpinner],
})
export class editProfilePage {
  @ViewChild('avatarModal') modal!: IonModal;

  form = new FormGroup({
    nickname: new FormControl('', [Validators.required, letterRequiredValidator]),
  });

  avatars = Array.from({ length: 10 }, (_, i) => `assets/profile/image${i + 1}.jpg`);
  currentAvatar: string | null = null;
  initialAvatar: string | null = null;

  submitting = false;
  toastMessage = '';
  toastOpen = false;
  toastColor: 'success' | 'danger' = 'success';

  private router = inject(Router);
  private profileStore = inject(ProfileStore);

  constructor() {
    addIcons({
      'person-outline': personOutline,
      'pencil-outline': pencilOutline,
      'person-circle-outline': personCircleOutline,
      'close': close,
    });

    const cached = authService.getCachedUser();
    this.form.patchValue({ nickname: cached?.username ?? '' });
    this.currentAvatar = this.profileStore.currentAvatar() ?? cached?.image ?? null;
    this.initialAvatar = this.currentAvatar;
  }

  openModal() {
    console.log('[click] edit-profile openModal');
    this.modal.present();
  }

  selectAvatar(img: string) {
    console.log('[click] edit-profile selectAvatar', { img });
    this.currentAvatar = img;
    this.profileStore.setAvatar(img);
    this.modal.dismiss();
  }

  closeModal() {
    console.log('[click] edit-profile closeModal');
    this.modal.dismiss();
  }

  async onSubmit(): Promise<void> {
    console.log('[click] edit-profile submit');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const nickname = (this.form.value.nickname ?? '').trim();

    this.submitting = true;
    try {
      // 0 = username
      const res = await authService.updateUser(0, nickname);
      console.log('[backend] update-user response', res);
      this.profileStore.setNickname(nickname);
      // Avatar is localStorage-only (per backend constraint), no API call.
      this.initialAvatar = this.currentAvatar;

      this.showToast('Profile updated', 'success');
      await this.router.navigate(['/tabs/profile']);
    } catch (err: any) {
      console.error('Profile update failed:', err);
      this.showToast(err?.response?.data?.message ?? 'Update failed', 'danger');
    } finally {
      this.submitting = false;
    }
  }

  private showToast(msg: string, color: 'success' | 'danger') {
    this.toastMessage = msg;
    this.toastColor = color;
    this.toastOpen = true;
  }
}
