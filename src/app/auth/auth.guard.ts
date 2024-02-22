import type {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Guard to redirect to another route if a flag is not enabled
 *
 * @param flag - Flag needed to proceed with current navigation
 * @param redirectRoute - Route to redirect to if flag is not enabled
 * @param route - This is the ActivatedRouteSnapshot that is passed into the guard
 */
export class AuthGuard {
  constructor(private router: Router) {}

  navigateSecurely() {
    const isLoggedInString = localStorage.getItem('isAuth');
    const isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;

    return isLoggedIn || this.router.navigateByUrl('home');
  }
}
