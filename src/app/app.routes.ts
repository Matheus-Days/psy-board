import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [authGuard(true)],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        m => m.RegisterComponent
      ),
    canActivate: [authGuard(true)],
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./pages/config/config.component').then(m => m.ConfigComponent),
    canActivate: [authGuard()],
  },
  {
    path: 'card',
    loadComponent: () =>
      import('./pages/card/card.component').then(m => m.CardComponent),
    canActivate: [authGuard()],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
