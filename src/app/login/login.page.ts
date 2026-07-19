import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonText, IonRouterLink, IonToast, IonSpinner, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { authService } from '../services/auth';

function nonEmptyValidator(control: AbstractControl): ValidationErrors | null {
  return control.value?.toString().trim().length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonText, IonRouterLink, IonToast, IonSpinner],
})
export class loginPage {
  form = new FormGroup({
    username: new FormControl('', [nonEmptyValidator]),
    password: new FormControl('', [nonEmptyValidator, Validators.minLength(6)]),
  });

  showPassword = false;
  submitting = false;
  toastMessage = '';
  toastOpen = false;

  private navController = inject(NavController);

  constructor() {
    addIcons({
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
    });
  }

  async onSubmit(): Promise<void> {
    console.log('[click] login submit');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.value as { username: string; password: string };
    console.log('[click] login submit -> authService.login', { username });
    this.submitting = true;
    try {
      const res = await authService.login(username, password);
      console.log('[backend] login response', res);
      if (res.user) {
        console.log('[nav] login -> navigateRoot /tabs/home');
        await this.navController.navigateRoot('/tabs/home', { animated: false });
        console.log('[nav] navigateRoot completed', { url: location.hash });
      } else {
        console.warn('[backend] login no user in response', res);
        const detail = res.message
          ?? (res.raw?.status ? `Status: ${res.raw.status}` : null)
          ?? JSON.stringify(res.raw ?? {}).slice(0, 80);
        const shown = typeof detail === 'string' ? detail : 'Login failed';
        console.log('[backend] login toast', shown);
        this.showToast(shown);
      }
    } catch (err: any) {
      console.error('[backend] login error', err);
      const detail =
        (typeof err?.response?.data === 'object' && err?.response?.data?.message) ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        err?.message ||
        (err?.response ? `HTTP ${err.response.status}` : 'Network error');
      const shown = typeof detail === 'string' ? detail.slice(0, 120) : 'Login failed';
      console.log('[backend] login toast', shown);
      this.showToast(shown);
    } finally {
      this.submitting = false;
    }
  }

  private showToast(msg: string) {
    this.toastMessage = msg;
    this.toastOpen = true;
  }
}
