import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginOrSignUpComponent } from '../login-or-sign-up/login-or-sign-up.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GameSessionService } from '../../services/game-session/game-session.service';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrEditGameSessionDialogueComponent } from '../create-or-edit-game-session-dialogue/create-or-edit-game-session-dialogue.component';
import { GameSession } from '../../types/game-session';
import { EventCardService } from '../../services/event-card.service';
import { WeaponCardService } from '../../services/weapon-card.service';
import { ItemCardService } from '../../services/item-card.service';

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
export class HomePageComponent implements OnInit, OnDestroy {
  protected gameSessionsParticipating: GameSession[] = [];
  private gameSessionsSub: Subscription;
  protected gameCode = '';

  constructor(
    protected authService: AuthService,
    protected router: Router,
    private gameSessionService: GameSessionService,
    public dialog: MatDialog,
    private eventCardService: EventCardService,
    private weaponCardService: WeaponCardService,
    private itemCardService: ItemCardService
  ) {
    this.gameSessionsSub = this.gameSessionService.usersGameSessions$.subscribe(
      (gameSessions) => {
        this.gameSessionsParticipating = gameSessions;
      }
    );
  }

  public async ngOnInit() {}

  ngOnDestroy(): void {
    this.gameSessionsSub.unsubscribe();
  }

  protected createNewGameSession(): void {
    const dialogRef = this.dialog.open(
      CreateOrEditGameSessionDialogueComponent,
      {
        // pass in a game session to edit if we want to edit it
        // data: {},
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      const newGameSession = result;
      newGameSession.userID = this.authService.activeUser?.uid;
      newGameSession.playerIDs = [this.authService.activeUser?.uid];
      newGameSession.entranceCode =
        this.gameSessionService.generateEntranceCode();

      this.gameSessionService
        .createNewGameSession(newGameSession)
        .then(async (result) => {
          this.gameSessionsParticipating.push(newGameSession);
          await this.createCardDecks(result.id);
          this.goToGameLobby(result.id);
        })
        .catch((err) => {
          console.error('Error creating game session:', err);
        });
    });
  }

  private async createCardDecks(gameSessionID: string) {
    await this.eventCardService.createEventCardDecks(gameSessionID);
    await this.weaponCardService.createWeaponCardDeck(gameSessionID);
    await this.itemCardService.createItemCardDeck(gameSessionID);
  }

  protected goToGameLobby(gameSessionId: string) {
    this.router.navigate([`game-session-lobby/${gameSessionId}`]);
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

  protected async joinGameSession(): Promise<void> {
    // Find a game Session based on the game code
    const gameSessionID =
      await this.gameSessionService.findGameSessionIDByEntranceCode(
        this.gameCode
      );

    this.gameSessionService
      .joinGameSession(gameSessionID)
      .then((gameSession) => {
        this.gameSessionsParticipating.push(gameSession);
        this.goToGameLobby(gameSessionID);
      })
      .catch((err) => {
        console.error('Error joining game session:', err);
      });
  }
}
