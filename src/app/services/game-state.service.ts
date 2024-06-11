import { Injectable, inject } from '@angular/core';
import { Character } from '../types/character';
import { AuthService } from '../auth/auth.service';
import { TurnService } from './turn.service';
import { GameSession } from '../types/game-session';
import { Npc, NpcType } from '../types/npc';
import { DeckName } from '../types/card-deck';
import { CardRewardType } from '../types/card-reward-type';
import { LocationKey, LocationNode } from './location-service';
import { NpcFactory } from './npcFactory.service';
import { NpcService } from './npc.service';

// I know haha....I just want to code this game already so I can play it.
// If I were to go back and redesign the game, I'd have the locations be the parents that house the state.
export type locationWithPeopleOnIt = {
  location: LocationNode;
  players: Character[];
  enemies: Npc[];
};

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  #authService: AuthService = inject(AuthService);
  #turnService: TurnService = inject(TurnService);
  #npcFactory: NpcFactory = inject(NpcFactory);
  #npcService: NpcService = inject(NpcService);

  public gameSession!: GameSession; // TODO dependant on the GameComponent to set this. I should try to refactor this component using an observable pattern.
  public allCharactersCurrentlyInGameSession: Character[] = [];
  public charactersBeingControlledByClient: Character[] = [];
  public characterBeingControlledByClient: Character | undefined;

  public npcsInPlay: Npc[] = []; // The NPCs currently in play on the game board.

  // Used to keep track of the state of the locations so we can adjust the UI accordingly and position everyone so they're not on top of each other.
  public locationsWithPeopleOnThem: Map<LocationKey, locationWithPeopleOnIt> =
    new Map();

  constructor() {}

  // Called when the game session is first loaded and when something moves.
  // Used to adjust the placement of things at locations.
  public adjustLocationsWithPeopleOnThem(): void {
    this.resetLocations();
    this.populateLocationsWithCharacters();
    this.populateLocationsWithNPCs();
    this.adjustPositionsForAllLocations();
  }

  private resetLocations(): void {
    this.locationsWithPeopleOnThem.clear();
  }

  private populateLocationsWithCharacters(): void {
    this.allCharactersCurrentlyInGameSession.forEach((character) => {
      this.addCharacterToLocation(character);
    });
  }

  private addCharacterToLocation(character: Character): void {
    const locationName = character.currentLocation.name;
    if (!this.locationsWithPeopleOnThem.has(locationName)) {
      this.locationsWithPeopleOnThem.set(locationName, {
        location: character.currentLocation,
        players: [character],
        enemies: [],
      });
    } else {
      this.locationsWithPeopleOnThem.get(locationName)?.players.push(character);
    }
  }

  private populateLocationsWithNPCs(): void {
    this.npcsInPlay.forEach((npc) => {
      this.addNPCToLocation(npc);
    });
  }

  private addNPCToLocation(npc: Npc): void {
    const locationName = npc.currentLocation.name;
    if (!this.locationsWithPeopleOnThem.has(locationName)) {
      this.locationsWithPeopleOnThem.set(locationName, {
        location: npc.currentLocation,
        players: [],
        enemies: [npc],
      });
    } else {
      this.locationsWithPeopleOnThem.get(locationName)?.enemies.push(npc);
    }
  }

  private adjustPositionsForAllLocations(): void {
    this.locationsWithPeopleOnThem.forEach((location) => {
      this.adjustPositionsForLocation(location);
    });
  }

  private adjustPositionsForLocation(location: locationWithPeopleOnIt): void {
    this.adjustPlayerPositions(location);
    this.adjustEnemyPositions(location);
  }

  private adjustPlayerPositions(location: locationWithPeopleOnIt): void {
    const locationHasEnemies = location.enemies.length > 0;
    const locationHasOtherPlayers = location.players.length > 1;

    if (locationHasEnemies) {
      location.players.forEach((player, index) => {
        player.directionFacing = 'Right';
        player.position = {
          xPosition: location.location.position.xPosition + index - 50,
          yPosition: location.location.position.yPosition + index - 100,
        };
      });
    } else if (!locationHasEnemies && locationHasOtherPlayers) {
      location.players.forEach((player, index) => {
        player.position = {
          xPosition: location.location.position.xPosition + index + 50,
          yPosition: location.location.position.yPosition + 100,
        };
      });
    } else {
      // Only thing at the location...
      location.players.forEach((player) => {
        player.position = {
          xPosition: location.location.position.xPosition,
          yPosition: location.location.position.yPosition,
        };
      });
    }
  }

  private adjustEnemyPositions(location: locationWithPeopleOnIt): void {
    const locationHasPlayers = location.players.length > 0;
    const locationHasOtherEnemies = location.enemies.length > 1;

    if (locationHasPlayers) {
      location.enemies.forEach((enemy, index) => {
        enemy.directionFacing = 'Left';
        enemy.position = {
          xPosition: location.location.position.xPosition + index + 50,
          yPosition: location.location.position.yPosition - 100,
        };
      });
    } else if (!locationHasPlayers && locationHasOtherEnemies) {
      location.enemies.forEach((enemy, index) => {
        enemy.position = {
          xPosition: location.location.position.xPosition + index - 50,
          yPosition: location.location.position.yPosition - 100,
        };
      });
    } else {
      // Only thing at the location...
      location.enemies.forEach((enemy) => {
        enemy.position = {
          xPosition: location.location.position.xPosition,
          yPosition: location.location.position.yPosition,
        };
      });
    }
  }

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

  public async spawnNpcRelativeToPlayer(
    npcType: NpcType,
    deckName: DeckName,
    difficulty: CardRewardType,
    currentPlayer: Character
  ): Promise<void> {
    const newNpc: Npc = this.#npcFactory.generateNewNpc(
      npcType,
      currentPlayer.currentLocation,
      difficulty,
      this.#getDirectionFacingRelativeToPlayer(currentPlayer),
      deckName
    );

    const answer = await this.#npcService.addNewNpcToGameSession(
      newNpc,
      this.gameSession.id
    );

    console.log(answer);
  }

  #getDirectionFacingRelativeToPlayer(
    currentPlayer: Character
  ): 'Right' | 'Left' {
    // If the player is facing right, the npc should face left and vice versa.
    return currentPlayer.directionFacing === 'Right' ? 'Left' : 'Right';
  }
}
