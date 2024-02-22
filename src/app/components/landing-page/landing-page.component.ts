import { Component } from '@angular/core';
import { LoginOrSignUpComponent } from '../../auth/components/login-or-sign-up/login-or-sign-up.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LoginOrSignUpComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  constructor(protected authService: AuthService) {}
}
