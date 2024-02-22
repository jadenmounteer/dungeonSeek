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
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  provideAuth,
} from '@angular/fire/auth';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// I used this video to figure out how to use the config
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
