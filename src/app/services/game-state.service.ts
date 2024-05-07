import { Injectable, inject } from '@angular/core';
import { Character } from '../types/character';
import { AuthService } from '../auth/auth.service';
import { TurnService } from './turn.service';
import { GameSession } from '../types/game-session';
import { NpcType } from '../types/npc';
import { DeckName } from '../types/card-deck';
import { CardRewardType } from '../types/card-reward-type';
import { LocationNode } from './location-service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  #authService: AuthService = inject(AuthService);
  #turnService: TurnService = inject(TurnService);

  public gameSession!: GameSession; // TODO dependant on the GameComponent to set this. I should try to refactor this component using an observable pattern.
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

  public async spawnNpc(
    npcType: NpcType,
    deckName: DeckName,
    difficulty: CardRewardType,
    locationToSpawnAt: LocationNode
  ): Promise<void> {}
}
