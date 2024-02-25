import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
export class LoginOrSignUpComponent implements OnDestroy {
  signUpForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    displayName: new FormControl('', [Validators.required]),
  });

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  private forgotPasswordSub: Subscription | null = null;

  protected error = '';
  protected message = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.forgotPasswordSub?.unsubscribe();
  }

  protected submitLogin() {
    if (this.loginForm.valid) {
      this.login(this.loginForm.value.email, this.loginForm.value.password);
    } else {
      this.error = 'Invalid email or password';
    }
  }

  protected submitSignUp() {
    if (this.signUpForm.valid) {
      this.signUp(
        this.signUpForm.value.email,
        this.signUpForm.value.password,
        this.signUpForm.value.displayName
      );
    } else {
      this.error = 'Invalid email or password';
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
        },
      });
  }

  // example register with email
  protected signUp(email: string, password: string, displayName: string) {
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
        next: (userDetails) => {
          this.authService.createUserData(userDetails.user, displayName);
          localStorage.setItem('isAuth', JSON.stringify(true));
        },
      });
  }

  protected forgotPassword() {
    if (this.loginForm.value.email) {
      this.forgotPasswordSub = this.authService
        .forgotPassword(this.loginForm.value.email)
        .subscribe({
          next: () => {
            // show a message to the user
            this.message = `Password reset email sent to ${this.loginForm.value.email}`;
          },
        });
    } else {
      this.error = 'Please provide an email to send the reset link to.';
    }
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
