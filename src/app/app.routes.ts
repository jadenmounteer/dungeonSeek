import { Routes } from '@angular/router';
import { HomePageComponent } from './auth/components/home-page/home-page.component';
import { GameComponent } from './auth/components/game-component/game.component';

import { AuthGuard } from './auth/auth.guard';
import { inject } from '@angular/core';
import { LandingPageComponent } from './auth/components/landing-page/landing-page.component';
import { LoginOrSignUpComponent } from './auth/components/login-or-sign-up/login-or-sign-up.component';
import { GameSessionLobbyComponent } from './game-session-lobby/game-session-lobby.component';

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
    component: GameComponent,
    canActivate: [() => inject(AuthGuard).navigateSecurely()],
  },
  {
    path: 'game-session-lobby/:gameSessionId',
    canActivate: [() => inject(AuthGuard).navigateSecurely()],
    loadComponent: () =>
      import('./game-session-lobby/game-session-lobby.component').then(
        (m) => m.GameSessionLobbyComponent
      ),
    data: {
      title: 'Game Session Lobby',
    },
  },
  {
    path: '',
    component: LandingPageComponent,
  },
];
