import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { GameComponent } from './components/game/game.component';

import { AuthGuard } from './auth/auth.guard';
import { inject } from '@angular/core';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginOrSignUpComponent } from './auth/components/login-or-sign-up/login-or-sign-up.component';

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
    path: '',
    component: HomePageComponent,
  },
];
