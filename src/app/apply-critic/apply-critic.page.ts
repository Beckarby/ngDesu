import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonInput, IonLabel, IonText, IonIcon, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline } from 'ionicons/icons';

function nonBlankValidator(control: AbstractControl): ValidationErrors | null {
  return control.value?.toString().trim().length > 0 ? null : { blank: true };
}

@Component({
  selector: 'app-apply-critic',
  templateUrl: 'apply-critic.page.html',
  styleUrls: ['apply-critic.page.scss'],
  imports: [ReactiveFormsModule, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonInput, IonLabel, IonText, IonIcon, IonTextarea],
})
export class applyCriticPage {
  form = new FormGroup({
    firstName: new FormControl('', [nonBlankValidator, Validators.minLength(2)]),
    lastName: new FormControl('', [nonBlankValidator, Validators.minLength(2)]),
    blogInfo: new FormControl('', [nonBlankValidator, Validators.minLength(10)]),
  });

  private router = inject(Router);

  constructor() {
    addIcons({ 'send-outline': sendOutline });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Critic application:', this.form.value);
  }
}
