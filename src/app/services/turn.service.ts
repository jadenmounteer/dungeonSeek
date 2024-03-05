import { Injectable } from '@angular/core';
import { GameSession } from '../types/game-session';
import { Character } from '../types/character';
import { GameSessionService } from './game-session/game-session.service';

@Injectable({
  providedIn: 'root',
})
export class TurnService {
  constructor(private gameSessionservice: GameSessionService) {}

  // Everyone, including monsters go at the same time.
  // However, the players on the current client must move together.
  public isItMyTurnOnClientSide(
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

  public endCharacterTurn(gameSession: GameSession, characterID: string) {
    const currentTurn = gameSession.currentTurn;

    currentTurn.characterIDsWhoHaveTakenTurn.push(characterID);

    this.gameSessionservice.updateGameSession(gameSession);
  }

  public async createNewTurn(
    gameSession: GameSession,
    characterIDs: string[]
  ): Promise<void> {
    const newTurnNumber = gameSession.currentTurn.turnNumber + 1;
    const newTurn = {
      characterIDsWhoHaveTakenTurn: [],
      characterIDs,
      turnNumber: newTurnNumber,
    };

    gameSession.currentTurn = newTurn;

    return this.gameSessionservice.updateGameSession(gameSession);
  }
}
