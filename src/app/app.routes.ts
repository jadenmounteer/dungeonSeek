import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { GameComponent } from './components/game/game.component';

import { AuthGuard } from './auth/auth.guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
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
