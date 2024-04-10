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
import { CharacterService } from '../../services/character/character.service';
import { AuthService } from '../../auth/auth.service';
import { EventCardService } from '../../services/event-card.service';
import { WeaponCardService } from '../../services/weapon-card.service';
import { ItemCardService } from '../../services/item-card.service';

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
  protected characters: Character[] = [];
  protected charactersSub!: Subscription;

  constructor(
    private gameSessionService: GameSessionService,
    private activatedRoute: ActivatedRoute,
    protected router: Router,
    private dialog: MatDialog,
    private characterService: CharacterService,
    protected authService: AuthService,
    private eventCardService: EventCardService,
    private weaponCardService: WeaponCardService,
    private itemCardService: ItemCardService
  ) {
    const gameSessionID = this.activatedRoute.snapshot.params['gameSessionId'];

    this.gameSessionSub = this.gameSessionService
      .getGameSession(gameSessionID)
      .subscribe(async (gameSession) => {
        this.gameSession = gameSession;

        await this.loadGameCards();

        // TODO I can probably do this in a cleaner way with RXJS.
        // I know there's an operator where you can subscribe to multiple observables at once.
        this.setCharactersSub();
      });
  }

  private async loadGameCards(): Promise<void> {
    await this.eventCardService.fetchCardInfoFromJSON();
    await this.weaponCardService.fetchCardInfoFromJSON();
    await this.itemCardService.fetchCardInfoFromJSON();
  }

  private setCharactersSub(): void {
    this.charactersSub = this.characterService
      .getCharactersInGameSession(this.gameSession.id)
      .subscribe((characters) => {
        this.characters = characters;
        this.loading = false;
      });
  }
  ngOnDestroy(): void {
    this.gameSessionSub.unsubscribe();
    this.charactersSub.unsubscribe();
  }

  protected enterGame(): void {
    this.router.navigate([`game-view/${this.gameSession.id}`]);
  }

  protected addCharacter(): void {
    const dialogRef = this.dialog.open(AddOrEditCharacterComponent);

    dialogRef.afterClosed().subscribe((newCharacter) => {
      if (!newCharacter) return;

      this.gameSessionService
        .addCharacterToGameSession(this.gameSession.id, newCharacter)
        .catch((err) => {
          console.error('Error creating game session:', err);
        });
    });
  }
}
