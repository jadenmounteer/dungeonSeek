import { Component, OnDestroy } from '@angular/core';
import { GameSessionService } from '../../services/game-session/game-session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameSession } from '../../types/game-session';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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
  protected players: string[] = [];

  constructor(
    private gameSessionService: GameSessionService,
    private activatedRoute: ActivatedRoute,
    protected router: Router
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
}
