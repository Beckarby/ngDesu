import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { authService } from '../services/auth';

async function isAuthenticated(): Promise<boolean> {
  return authService.getCachedUser() !== null;
}

export const authMatchGuard: CanMatchFn = async () => {
  const router = inject(Router);
  return (await isAuthenticated()) ? true : router.parseUrl('/login');
};

export const authActivateGuard: CanActivateFn = async () => {
  const router = inject(Router);
  return (await isAuthenticated()) ? true : router.parseUrl('/login');
};