import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonLabel, IonInput, IonText, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, pencilOutline, personCircleOutline } from 'ionicons/icons';

function letterRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value?.toString() ?? '';
  return /[a-zA-Z]/.test(val.trim()) ? null : { letterRequired: true };
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonLabel, IonInput, IonText, IonRouterLink],
})
export class editProfilePage {
  form = new FormGroup({
    nickname: new FormControl('', [Validators.required, letterRequiredValidator]),
  });

  private router = inject(Router);

  constructor() {
    addIcons({
      'person-outline': personOutline,
      'pencil-outline': pencilOutline,
      'person-circle-outline': personCircleOutline,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Edit Profile:', this.form.value);
  }
}
