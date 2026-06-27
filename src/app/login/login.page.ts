import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonText, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

function nonEmptyValidator(control: AbstractControl): ValidationErrors | null {
  return control.value?.toString().trim().length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonText, IonRouterLink],
})
export class loginPage {
  form = new FormGroup({
    username: new FormControl('', [nonEmptyValidator]),
    password: new FormControl('', [nonEmptyValidator, Validators.minLength(6)]),
  });

  showPassword = false;

  private router = inject(Router);

  constructor() {
    addIcons({ 
      'eye-outline': eyeOutline, 
      'eye-off-outline': eyeOffOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log('Form errors:', this.form.errors);
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
  }
}