import { Injectable, signal } from '@angular/core';
import { authService, AuthUser } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  readonly currentAvatar = signal<string | null>(null);
  readonly nickname = signal<string | null>(null);

  /** Load avatar/username from the cached user (if any). */
  loadFromCache(): void {
    const cached = authService.getCachedUser();
    if (cached) {
      this.nickname.set(cached.username);
      if (cached.image) this.currentAvatar.set(cached.image);
    }
  }

  /** Push a full user object into the store and localStorage. */
  setUser(user: AuthUser): void {
    localStorage.setItem('ngdesu_user', JSON.stringify(user));
    this.nickname.set(user.username);
    this.currentAvatar.set(user.image || null);
  }

  /** Update just the nickname (also writes to localStorage if cached). */
  setNickname(nickname: string): void {
    this.nickname.set(nickname);
    const cached = authService.getCachedUser();
    if (cached) {
      this.setUser({ ...cached, username: nickname });
    }
  }

  /** Update just the avatar (also writes to localStorage if cached). */
  setAvatar(avatar: string | null): void {
    this.currentAvatar.set(avatar);
    if (!avatar) return;
    const cached = authService.getCachedUser();
    if (cached) {
      this.setUser({ ...cached, image: avatar });
    }
  }

  /** Clear everything (used on sign out). */
  clear(): void {
    this.nickname.set(null);
    this.currentAvatar.set(null);
  }
}
