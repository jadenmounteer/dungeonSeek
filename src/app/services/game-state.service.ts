import { Injectable, inject } from '@angular/core';
import { Character } from '../types/character';
import { AuthService } from '../auth/auth.service';
import { TurnService } from './turn.service';
import { GameSession } from '../types/game-session';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  #authService: AuthService = inject(AuthService);
  #turnService: TurnService = inject(TurnService);

  public gameSession!: GameSession;
  public allCharactersCurrentlyInGameSession: Character[] = [];
  public charactersBeingControlledByClient: Character[] = [];
  public characterBeingControlledByClient: Character | undefined;

  constructor() {}

  public setCharactersBeingControlledByClient(): void {
    // set this.characterStateService.charactersBeingControlledByClient to the characters that share the same userID as the client
    this.charactersBeingControlledByClient =
      this.allCharactersCurrentlyInGameSession.filter((character) => {
        return character.userId === this.#authService.activeUser?.uid;
      });
  }

  public determineWhosNextToBeControlledByClient(
    gameSession: GameSession
  ): void {
    this.charactersBeingControlledByClient.forEach((character) => {
      if (this.#turnService.isItMyTurnOnClientSide(gameSession, character.id)) {
        this.characterBeingControlledByClient = character;
      }
    });
  }
}
