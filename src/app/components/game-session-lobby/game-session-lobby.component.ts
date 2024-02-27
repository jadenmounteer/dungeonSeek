import { Component, OnDestroy } from '@angular/core';
import { GameSessionService } from '../../services/game-session/game-session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameSession } from '../../types/game-session';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Character } from '../../types/character';
import { MatDialog } from '@angular/material/dialog';
import { AddOrEditCharacterComponent } from '../add-or-edit-character/add-or-edit-character.component';

@Component({
  selector: 'app-game-session-lobby',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './game-session-lobby.component.html',
  styleUrl: './game-session-lobby.component.scss',
})
export class GameSessionLobbyComponent implements OnDestroy {
  protected loading = true;
  protected gameSession!: GameSession;
  private gameSessionSub: Subscription;
  protected players: Character[] = [];

  constructor(
    private gameSessionService: GameSessionService,
    private activatedRoute: ActivatedRoute,
    protected router: Router,
    private dialog: MatDialog
  ) {
    const gameSessionID = this.activatedRoute.snapshot.params['gameSessionId'];

    this.gameSessionSub = this.gameSessionService
      .getGameSession(gameSessionID)
      .subscribe((gameSession) => {
        this.gameSession = gameSession;
        this.loading = false;
      });
  }
  ngOnDestroy(): void {
    this.gameSessionSub.unsubscribe();
  }

  protected enterGame(): void {
    this.router.navigate([`game-view/${this.gameSession.id}`]);
  }

  protected addCharacter(): void {
    const dialogRef = this.dialog.open(AddOrEditCharacterComponent);

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
