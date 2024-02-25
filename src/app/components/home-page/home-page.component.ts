import { Component, OnInit } from '@angular/core';
import { LoginOrSignUpComponent } from '../../auth/components/login-or-sign-up/login-or-sign-up.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { GameSessionService } from '../../services/game-session/game-session.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [LoginOrSignUpComponent, MatButtonModule, CommonModule],
})
export class HomePageComponent implements OnInit {
  protected currentGame = null;
  constructor(
    protected authService: AuthService,
    protected router: Router,
    private gameSessionService: GameSessionService
  ) {}

  public async ngOnInit() {}

  protected createNewGameSession() {
    this.gameSessionService
      .createNewGameSession('userID', 'gameName', 'AN AWESOME CAMPAIGN NAME!')
      .then((result) => {
        console.log('Game session created:', result);
      })
      .catch((err) => {
        console.error('Error creating game session:', err);
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
}
