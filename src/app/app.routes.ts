import { Routes } from '@angular/router';
import { authActivateGuard, authMatchGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.loginPage),
  },
  {
    path: 'anime/:id',
    canActivate: [authActivateGuard],
    loadComponent: () => import('./anime-detail/anime-detail.page').then((m) => m.AnimeDetailPage),
  },
  {
    path: 'tabs',
    canMatch: [authMatchGuard],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
