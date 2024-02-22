import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-or-sign-up',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    CommonModule,
  ],
  templateUrl: './login-or-sign-up.component.html',
  styleUrl: './login-or-sign-up.component.scss',
})
export class LoginOrSignUpComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  @Input() error: string | null = null;

  @Output() submitEM = new EventEmitter();
  constructor(private authService: AuthService, private router: Router) {}

  protected submitLogin() {
    if (this.form.valid) {
      this.login(this.form.value.email, this.form.value.password);
    }
  }

  protected submitSignUp() {
    if (this.form.valid) {
      this.signUp(this.form.value.email, this.form.value.password);
    }
  }

  // 'mounteerjaden@gmail.com', 'valid_firebase_password'
  protected login(email: string, password: string) {
    this.authService
      .login(email, password)
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
          this.router.navigateByUrl('/home');
        },
      });
  }

  // example register with email
  protected signUp(email: string, password: string) {
    const rnd = Math.floor(Math.random() * 1000);

    this.authService
      .signup(email, password, {})
      .pipe(
        catchError((err) => {
          // handle the error
          return throwError(() => new Error(err));
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
