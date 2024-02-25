import { Component, OnInit } from '@angular/core';
import { LoginOrSignUpComponent } from '../../auth/components/login-or-sign-up/login-or-sign-up.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GameSessionService } from '../../services/game-session/game-session.service';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrEditGameSessionDialogueComponent } from '../create-or-edit-game-session-dialogue/create-or-edit-game-session-dialogue.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [
    LoginOrSignUpComponent,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class HomePageComponent implements OnInit {
  protected currentGame = null;
  constructor(
    protected authService: AuthService,
    protected router: Router,
    private gameSessionService: GameSessionService,
    public dialog: MatDialog
  ) {}

  public async ngOnInit() {}

  protected createNewGameSession(): void {
    const dialogRef = this.dialog.open(
      CreateOrEditGameSessionDialogueComponent,
      {
        // pass in a game session to edit if we want to edit it
        data: {},
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      const newGameSession = result;

      // this.gameSessionService
      //   .createNewGameSession(newGameSession)
      //   .then((result) => {
      //     console.log('Game session created:', result);
      //   })
      //   .catch((err) => {
      //     console.error('Error creating game session:', err);
      //   });
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
