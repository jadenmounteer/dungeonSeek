import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/**
 * This service updates the downloaded application when it detects changes.
 * This is where I got it from: https://angular.io/guide/service-worker-communications
 * I may want to add a confirmation dialog before updating the app in the future.
 */
@Injectable({ providedIn: 'root' })
export class PromptUpdateService {
  constructor(swUpdate: SwUpdate) {
    swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe((evt) => {
        // if (promptUser(evt)) {
        //   // Reload the page to update to the latest version.
        //   document.location.reload();
        // }
        // // Reload the page to update to the latest version.

        // only update the app if a new version is ready
        if (
          confirm(
            'A new version of the app is available. Would you like to update?'
          )
        ) {
          document.location.reload();
        }
      });
  }
}
