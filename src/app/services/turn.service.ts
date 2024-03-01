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
  isItMyTurnOnClientSide(
    gameSession: GameSession,
    characterID: string
  ): boolean {
    const currentTurn = gameSession.currentTurn;

    const characterIDsWhoHaveTakenTurn =
      currentTurn.characterIDsWhoHaveTakenTurn;

    if (characterIDsWhoHaveTakenTurn.includes(characterID)) {
      return false;
    }

    return true;
  }
}
