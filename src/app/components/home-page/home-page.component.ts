import { Component } from '@angular/core';
import { LoginOrSignUpComponent } from '../../auth/components/login-or-sign-up/login-or-sign-up.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [LoginOrSignUpComponent],
})
export class HomePageComponent {
  constructor(protected authService: AuthService) {}
}
