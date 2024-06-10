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
import { Subject } from 'rxjs';

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

  public uiChangedSubject: Subject<void> = new Subject<void>();

  constructor() {}

  // Called when the game session is first loaded and when something moves.
  // Used to adjust the placement of things at locations.
  public adjustLocationsWithPeopleOnThem(): void {
    // Resent the map
    this.locationsWithPeopleOnThem.clear();
    // Loop through all of the characters on the map.
    this.allCharactersCurrentlyInGameSession.forEach((character) => {
      // If the location is not in the map, add it.
      if (!this.locationsWithPeopleOnThem.has(character.currentLocation.name)) {
        this.locationsWithPeopleOnThem.set(character.currentLocation.name, {
          location: character.currentLocation,
          players: [character],
          enemies: [],
        });
      } else {
        // If the location is in the map, add the character to the players array.
        this.locationsWithPeopleOnThem
          .get(character.currentLocation.name)
          ?.players.push(character);
      }
    });

    // Now, loop through all of the npcs on the map.
    this.npcsInPlay.forEach((npc) => {
      // If the location is not in the map, add it.
      if (!this.locationsWithPeopleOnThem.has(npc.currentLocation.name)) {
        this.locationsWithPeopleOnThem.set(npc.currentLocation.name, {
          location: npc.currentLocation,
          players: [],
          enemies: [npc],
        });
      } else {
        // If the location is in the map, add the npc to the enemies array.
        this.locationsWithPeopleOnThem
          .get(npc.currentLocation.name)
          ?.enemies.push(npc);
      }
    });

    // Now that we have the locations with people on them, we can adjust the UI accordingly.
    // Loop through everyone again and adjust their positions relative to the other people at the same location.
    this.locationsWithPeopleOnThem.forEach((location) => {
      // If there are people at the location, adjust their positions.
      if (location.players.length > 0) {
        // Adjust the positions of the players.
        location.players.forEach((player, index) => {
          console.log(
            `Setting ${player.name} to location ${location.location.name}`
          );

          // Adjust the position of the player based on the index.
          player.position = {
            xPosition: location.location.position.xPosition + index - 50,
            yPosition: location.location.position.yPosition + index - 100,
          };

          console.log(
            `${player.name}'s current position is now: ${player.position.xPosition}, ${player.position.yPosition}`
          );
        });
      }

      // If there are enemies at the location, adjust their positions.
      if (location.enemies.length > 0) {
        // Adjust the positions of the enemies.
        location.enemies.forEach((enemy, index) => {
          // Adjust the position of the enemy based on the index.
          enemy.position = {
            xPosition: location.location.position.xPosition + index * 50,
            yPosition: location.location.position.yPosition,
          };
        });
      }
    });

    // Emit a subject to update the UI.
    this.uiChangedSubject.next();
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
