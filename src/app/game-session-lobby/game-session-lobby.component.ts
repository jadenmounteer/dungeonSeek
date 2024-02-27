import { Component, OnDestroy } from '@angular/core';
import { GameSessionService } from '../services/game-session/game-session.service';
import { ActivatedRoute } from '@angular/router';
import { GameSession } from '../types/game-session';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-session-lobby',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-session-lobby.component.html',
  styleUrl: './game-session-lobby.component.scss',
})
export class GameSessionLobbyComponent implements OnDestroy {
  protected loading = true;
  protected gameSession!: GameSession;
  private gameSessionSub: Subscription;

  constructor(
    private gameSessionService: GameSessionService,
    private activatedRoute: ActivatedRoute
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
}
