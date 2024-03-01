import { Injectable } from '@angular/core';
import { GameSession } from '../types/game-session';
import { Character } from '../types/character';

@Injectable({
  providedIn: 'root',
})
export class TurnService {
  constructor() {}

  // Everyone, including monsters go at the same time.
  // However, the players on the current client must move together.
  determineWhosTurnItIsForClient(
    gameSession: GameSession,
    charactersBeingControlledByClient: Character[]
  ): string {
    const currentTurn = gameSession.currentTurn;
    const characterIDsWhoHaveTakenTurn =
      currentTurn.characterIDsWhoHaveTakenTurn;

    let characterIDOfNextPlayer = '';
    charactersBeingControlledByClient.forEach((character) => {
      if (!characterIDsWhoHaveTakenTurn.includes(character.id)) {
        characterIDOfNextPlayer = character.id;
        return;
      }
    });

    return characterIDOfNextPlayer;
  }
}
