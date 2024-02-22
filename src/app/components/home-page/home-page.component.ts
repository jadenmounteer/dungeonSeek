import { Component } from '@angular/core';
import { LoginOrSignUpComponent } from '../../auth/components/login-or-sign-up/login-or-sign-up.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [LoginOrSignUpComponent],
})
export class HomePageComponent {}
