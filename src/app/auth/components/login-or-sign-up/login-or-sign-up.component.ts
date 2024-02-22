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
  login() {
    this.authService
      .Login('mounteerjaden@gmail.com', 'valid_firebase_password')
      .pipe(
        catchError((err) => {
          // handle the error
          return throwError(() => new Error('test'));
        })
      )
      .subscribe({
        next: (user) => {
          // redirect to the game page for now
          this.router.navigateByUrl('/game');
        },
      });
  }

  // example register with email
  signUp() {
    const rnd = Math.floor(Math.random() * 1000);

    this.authService
      .Signup(`mounteerjaden@gmail.com`, 'valid_firebase_password', {
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
          // redirect to the game page for now
          this.router.navigateByUrl('/game');
        },
      });
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
