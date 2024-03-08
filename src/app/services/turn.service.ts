import { Injectable } from '@angular/core';
import { GameSession } from '../types/game-session';
import { Character } from '../types/character';
import { GameSessionService } from './game-session/game-session.service';
import { CharacterService } from './character/character.service';

@Injectable({
  providedIn: 'root',
})
export class TurnService {
  constructor(
    private gameSessionservice: GameSessionService,
    private characterService: CharacterService
  ) {}

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

  public async endCharacterTurn(
    gameSession: GameSession,
    characterID: string
  ): Promise<void> {
    gameSession.currentTurn.characterIDsWhoHaveTakenTurn.push(characterID);

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
      playerIDsWhoHaveFinishedTurn: [],
      npcIDsWhoHaveTakenTurn: [],
    };

    gameSession.currentTurn = newTurn;

    return this.gameSessionservice.updateGameSession(gameSession);
  }

  public async resetCharacterMovementSpeeds(
    charactersBeingControlledByClient: Character[],
    gameSessionID: string
  ): Promise<void> {
    charactersBeingControlledByClient.forEach((character) => {
      console.log(`Resetting movement speed for ${character.name}`);
      // TODO have a base movement speed that increases if they have a horse.
      character.movementSpeed = 4;
    });

    charactersBeingControlledByClient.forEach((character) => {
      this.characterService.updateCharacter(character, gameSessionID);
    });
  }

  public async signalToServerThatPlayerIsDone(
    playerID: string,
    gameSession: GameSession
  ) {
    gameSession.currentTurn.playerIDsWhoHaveFinishedTurn.push(playerID);

    return this.gameSessionservice.updateGameSession(gameSession);
  }

  public allPlayersHaveFinishedTheirTurn(gameSession: GameSession): boolean {
    let allPlayersHaveFinishedTurn = true;

    gameSession.playerIDsCurrentlyInGame.forEach((playerID) => {
      if (
        !gameSession.currentTurn.playerIDsWhoHaveFinishedTurn.includes(playerID)
      ) {
        allPlayersHaveFinishedTurn = false;
      }
    });

    return allPlayersHaveFinishedTurn;
  }

  public async clearClientCharacterIDsFromTurnArray(
    gameSession: GameSession,
    clientCharacters: Character[]
  ): Promise<void> {
    gameSession.currentTurn.characterIDsWhoHaveTakenTurn =
      gameSession.currentTurn.characterIDsWhoHaveTakenTurn.filter(
        (id) => !clientCharacters.map((c) => c.id).includes(id)
      );

    await this.gameSessionservice.updateGameSession(gameSession);
  }
}
