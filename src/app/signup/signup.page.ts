import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IonContent, IonInput, IonLabel, IonButton, IonIcon, IonText, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, personOutline } from 'ionicons/icons';

function nonEmptyValidator(control: AbstractControl): ValidationErrors | null {
  return control.value?.toString().trim().length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonInput, IonLabel, IonButton, IonIcon, IonText, IonRouterLink],
})
export class SignupPage {
  form = new FormGroup({
    username: new FormControl('', [nonEmptyValidator]),
    firstName: new FormControl('', [nonEmptyValidator]),
    lastName: new FormControl('', [nonEmptyValidator]),
    email: new FormControl('', [nonEmptyValidator, Validators.email]),
    password: new FormControl('', [nonEmptyValidator, Validators.minLength(6)]),
  });

  showPassword = false;

  private router = inject(Router);

  constructor() {
    addIcons({ 
      'eye-outline': eyeOutline, 
      'eye-off-outline': eyeOffOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'person-outline': personOutline
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log('Form errors:', this.form.errors);
      this.form.markAllAsTouched(); // Trigger validation UI
      return;
    }
    console.log('Signup Data:', this.form.value);
  }
}