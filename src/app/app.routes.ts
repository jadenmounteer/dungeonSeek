import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { GameComponent } from './components/game-component/game.component';

import { AuthGuard } from './auth/auth.guard';
import { inject } from '@angular/core';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginOrSignUpComponent } from './components/login-or-sign-up/login-or-sign-up.component';
import { GameSessionLobbyComponent } from './components/game-session-lobby/game-session-lobby.component';

export const routes: Routes = [
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  {
    path: 'login-or-sign-up',
    component: LoginOrSignUpComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [() => inject(AuthGuard).navigateSecurely()],
  },
  {
    path: 'game',
    canActivate: [() => inject(AuthGuard).navigateSecurely()],
    loadComponent: () =>
      import('./components/game-component/game.component').then(
        (m) => m.GameComponent
      ),
  },
  {
    path: 'game-session-lobby/:gameSessionId',
    canActivate: [() => inject(AuthGuard).navigateSecurely()],
    loadComponent: () =>
      import(
        './components/game-session-lobby/game-session-lobby.component'
      ).then((m) => m.GameSessionLobbyComponent),
  },
  {
    path: '',
    component: LandingPageComponent,
  },
];
