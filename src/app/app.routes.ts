import { Routes } from '@angular/router';

export const routes: Routes = [
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
    loadComponent: () => import('./anime-detail/anime-detail.page').then((m) => m.AnimeDetailPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
