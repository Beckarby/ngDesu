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
        this.showToast(res.message ?? 'Login failed');
      }
    } catch (err: any) {
      console.error('[backend] login error', err);
      this.showToast(err?.response?.data?.message ?? 'Login failed');
    } finally {
      this.submitting = false;
    }
  }

  private showToast(msg: string) {
    this.toastMessage = msg;
    this.toastOpen = true;
  }
}
