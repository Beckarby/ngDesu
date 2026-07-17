import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.homePage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../search/search.page').then((m) => m.searchPage),
      },
      {
        path: 'library',
        loadComponent: () =>
          import('../library/library.page').then((m) => m.libraryPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.profilePage),
      },
      {
        path: 'edit-profile',
        loadComponent: () =>
          import('../edit-profile/edit-profile.page').then((m) => m.editProfilePage),
      },
      {
        path: 'apply-critic',
        loadComponent: () =>
          import('../apply-critic/apply-critic.page').then((m) => m.applyCriticPage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
