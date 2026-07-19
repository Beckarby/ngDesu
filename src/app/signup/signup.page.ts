import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IonContent, IonInput, IonLabel, IonButton, IonIcon, IonText, IonRouterLink, IonToast, IonSpinner, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import { authService } from '../services/auth';

function nonEmptyValidator(control: AbstractControl): ValidationErrors | null {
  return control.value?.toString().trim().length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonInput, IonLabel, IonButton, IonIcon, IonText, IonRouterLink, IonToast, IonSpinner],
})
export class SignupPage {
  form = new FormGroup({
    username: new FormControl('', [nonEmptyValidator]),
    email: new FormControl('', [nonEmptyValidator, Validators.email]),
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
      'person-outline': personOutline,
    });
  }

  async onSubmit(): Promise<void> {
    console.log('[click] signup submit');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, email, password } = this.form.value as { username: string; email: string; password: string };
    console.log('[click] signup submit -> authService.register', { username, email });
    this.submitting = true;
    try {
      const res = await authService.register(username, email, password);
      console.log('[backend] register response', res);
      if (res.status === 'success') {
        console.log('[nav] signup -> navigateRoot /tabs/home');
        await this.navController.navigateRoot('/tabs/home', { animated: false });
        console.log('[nav] signup navigateRoot completed', { url: location.hash });
      } else {
        console.warn('[backend] signup no success status', res);
        const detail = res.message
          ?? (res.status ? `Status: ${res.status}` : null);
        const shown = (typeof detail === 'string' && detail) ? detail : 'Registration failed';
        console.log('[backend] signup toast', shown);
        this.showToast(shown);
      }
    } catch (err: any) {
      console.error('[backend] register error', err);
      const detail =
        (typeof err?.response?.data === 'object' && err?.response?.data?.message) ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        err?.message ||
        (err?.response ? `HTTP ${err.response.status}` : 'Network error');
      const shown = typeof detail === 'string' ? detail.slice(0, 120) : 'Registration failed';
      console.log('[backend] signup toast', shown);
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
