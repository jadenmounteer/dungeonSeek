import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// I used this video to figure out how to use the config

// This video might also be useful: https://www.youtube.com/watch?v=5npUxKPLT6c
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: environment.firebase.projectId,
          apiKey: environment.firebase.apiKey,
          authDomain: environment.firebase.authDomain,
          storageBucket: environment.firebase.storageBucket,
          messagingSenderId: environment.firebase.messagingSenderId,
          appId: environment.firebase.appId,
          measurementId: environment.firebase.measurementId,
        })
      )
    ),

    importProvidersFrom(
      provideAuth(() => {
        return getAuth();
      })
    ),

    importProvidersFrom(
      provideFirestore(() => {
        return getFirestore();
      })
    ),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimationsAsync(),
  ],
};
