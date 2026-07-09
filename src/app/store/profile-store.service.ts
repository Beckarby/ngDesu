import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  readonly currentAvatar = signal<string | null>(null);
  readonly nickname = signal<string | null>(null);
}
