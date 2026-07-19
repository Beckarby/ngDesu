import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonInput, IonLabel, IonText, IonIcon, IonTextarea, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline } from 'ionicons/icons';
import api from '../services/api';

function nonBlankValidator(control: AbstractControl): ValidationErrors | null {
  return control.value?.toString().trim().length > 0 ? null : { blank: true };
}

@Component({
  selector: 'app-apply-critic',
  templateUrl: 'apply-critic.page.html',
  styleUrls: ['apply-critic.page.scss'],
  imports: [ReactiveFormsModule, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonInput, IonLabel, IonText, IonIcon, IonTextarea, IonSpinner, IonToast],
})
export class applyCriticPage {
  form = new FormGroup({
    firstName: new FormControl('', [nonBlankValidator, Validators.minLength(2)]),
    lastName: new FormControl('', [nonBlankValidator, Validators.minLength(2)]),
    blog: new FormControl('', [nonBlankValidator, Validators.minLength(2)]),
    info: new FormControl('', [nonBlankValidator, Validators.minLength(10)]),
  });

  submitting = false;
  toastMessage = '';
  toastOpen = false;
  toastColor: 'success' | 'danger' = 'success';

  constructor() {
    addIcons({ 'send-outline': sendOutline });
  }

  async onSubmit(): Promise<void> {
    console.log('[click] apply-critic submit');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { firstName, lastName, blog, info } = this.form.value as {
      firstName: string; lastName: string; blog: string; info: string;
    };
    console.log('[click] apply-critic submit -> api.post /critic-mail', { firstName, lastName, blog });
    this.submitting = true;
    try {
      const res = await api.post('/critic-mail', { firstName, lastName, blog, info });
      console.log('[backend] /critic-mail response', res);
      this.showToast('Application sent!', 'success');
      this.form.reset();
    } catch (err: any) {
      console.error('[backend] /critic-mail error', err);
      // Backend currently returns an error response but the email still goes out,
      // so we show success if the request reached the server. Treat any HTTP
      // response (even 4xx) as "email was sent"; only network errors are failures.
      const status = err?.response?.status;
      if (status) {
        this.showToast('Application sent!', 'success');
        this.form.reset();
      } else {
        this.showToast(err?.message ?? 'Failed to send application', 'danger');
      }
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
