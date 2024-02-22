import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-or-sign-up',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './login-or-sign-up.component.html',
  styleUrl: './login-or-sign-up.component.scss',
})
export class LoginOrSignUpComponent {
  constructor(private authService: AuthService, private router: Router) {}
  protected login() {
    this.authService
      .login('mounteerjaden@gmail.com', 'valid_firebase_password')
      .pipe(
        catchError((err) => {
          // handle the error
          return throwError(() => new Error('test'));
        })
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('isAuth', JSON.stringify(true));
          // redirect to the game page for now
          this.router.navigateByUrl('/game');
        },
      });
  }

  protected logout() {
    this.authService
      .logout()
      .pipe(
        catchError((err) => {
          // handle the error
          return throwError(() => new Error('test'));
        })
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('isAuth', JSON.stringify(false));
          // redirect to the game page for now
          this.router.navigateByUrl('landing-page');
        },
      });
  }

  // example register with email
  protected signUp() {
    const rnd = Math.floor(Math.random() * 1000);

    this.authService
      .signup(`mounteerjaden@gmail.com`, 'valid_firebase_password', {
        bloodType: 'B+',
      })
      .pipe(
        catchError((err) => {
          // handle the error
          return throwError(() => new Error('test'));
        })
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('isAuth', JSON.stringify(true));

          // redirect to the game page for now
          this.router.navigateByUrl('/game');
        },
      });
  }

  protected forgotPassword() {
    // This has already been implemented in auth service
    throw new Error('Not implemented');
  }

  protected updateEmail() {
    // This has already been implemented in auth service
    throw new Error('Not implemented');
  }

  // example login with google, later we need to figure out the new user
  // loginGoogle() {
  //   this.authService
  //     .LoginGoogle()
  //     .pipe(catchError...)
  //     .subscribe({
  //       next: (user) => {
  //         this.router.navigateByUrl('/private/dashboard');
  //       }
  //     });
  // }
}
