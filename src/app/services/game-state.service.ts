import { Injectable, inject } from '@angular/core';
import { Character } from '../types/character';
import { AuthService } from '../auth/auth.service';
import { TurnService } from './turn.service';
import { GameSession } from '../types/game-session';
import { LocationKey, LocationNode } from './location-service';
import { NpcFactory } from './npcFactory.service';
import { NpcService } from './npc.service';
import { CombatSession } from './combat.service';
import { Npc, NpcType, NpcData } from '../types/npcs/npc';
import { DiceRollDialogueService } from './dice-roll-dialogue.service';

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
  diceRollDialogueService: DiceRollDialogueService = inject(
    DiceRollDialogueService
  );

  public gameSession!: GameSession; // TODO dependant on the GameComponent to set this. I should try to refactor this component using an observable pattern.
  public allCharactersCurrentlyInGameSession: Character[] = [];
  public charactersBeingControlledByClient: Character[] = [];
  public characterBeingControlledByClient: Character | undefined;
  public currentPlayersCombatTurn: boolean = false;
  public npcCombatTurn: boolean = false; // Tracks if it's an NPCs turn in a combat session.
  public currentPlayerSelectedEnemyToAttack: Npc | undefined;
  public npcCombatMessage: string = ''; // Used to display messages to the player during combat.

  public npcsInPlay: Npc[] = []; // The NPCs currently in play on the game board.

  public combatSessions: Map<string, CombatSession> = new Map(); // A map where the key is the combat session ID and the value is the combat session object.

  // Used to keep track of the state of the locations so we can adjust the UI accordingly and position everyone so they're not on top of each other.
  public locationsWithPeopleOnThem: Map<LocationKey, locationWithPeopleOnIt> =
    new Map();

  private distanceBetweenCharacters = 75;

  constructor() {}

  public createCombatSessionsMap(combatSessionsFromDB: CombatSession[]): void {
    combatSessionsFromDB.forEach((combatSession) => {
      this.combatSessions.set(combatSession.id, combatSession);
    });
  }

  public refreshCurrentPlayerCombatSessionsState(
    combatSessionID: string
  ): void {
    if (this.characterBeingControlledByClient) {
      // End their movement if they're entering combat
      this.characterBeingControlledByClient.movementSpeed = 0;
      this.diceRollDialogueService.currentCharacterRolledForEventCardThisTurn =
        true; // We don't allow them to roll for an event card if they're entering combat
    }

    if (!this.characterBeingControlledByClient) {
      return;
    }

    if (!this.characterBeingControlledByClient.combatSessionId) {
      this.characterBeingControlledByClient.combatSessionId = combatSessionID;
    }
    this.currentPlayersCombatTurn = this.isItMyTurnInCombatSession();
    if (this.currentPlayersCombatTurn) {
      this.npcCombatTurn = false;
    }
  }

  public refreshNPCsCombatSessionsState(): Npc | undefined {
    let npcWhosTurnItIs: Npc | undefined;
    // Loop through all of the NPCs
    for (let i = 0; i < this.npcsInPlay.length; i++) {
      const npc = this.npcsInPlay[i];
      // Check if the NPC is in a combat session
      if (npc.combatSessionID) {
        // Check if it is the NPC's turn
        const currentCombatSession = this.combatSessions.get(
          npc.combatSessionID
        );
        if (currentCombatSession) {
          const idOfNextCharacterOrNpcToGo = currentCombatSession.turnQueue[0];
          if (idOfNextCharacterOrNpcToGo === npc.id) {
            // If it is the NPC's turn, set the NPC's combat turn to true
            this.npcCombatTurn = true;
            this.npcCombatMessage = `Waiting for ${npc.npcType} to attack!`;
            npcWhosTurnItIs = npc;
            break; // Break out of the loop
          }
        }
      }
    }

    return npcWhosTurnItIs;
  }

  private isItMyTurnInCombatSession(): boolean {
    const currentCombatSession = this.combatSessions.get(
      this.characterBeingControlledByClient?.combatSessionId!
    );

    if (!currentCombatSession) {
      return false;
    }

    const idOfNextCharacterOrNpcToGo = currentCombatSession.turnQueue[0];

    return (
      idOfNextCharacterOrNpcToGo === this.characterBeingControlledByClient?.id
    );
  }

  // Called when the game session is first loaded and when something moves.
  // Used to adjust the placement of things at locations.
  public adjustLocationsWithPeopleOnThem(): void {
    this.resetLocations();
    this.populateLocationsWithCharacters();
    this.populateLocationsWithNPCs();
    this.adjustPositionsForAllLocations();
  }

  /**
   * If the current player has just been given a combatSessionID from an action from another player, this method updates their state.
   * @param characters
   */
  public updateCurrentPlayerCombatState(characters: Character[]): void {
    const currentPlayer = characters.find(
      (character) => character.id === this.characterBeingControlledByClient?.id
    );

    if (
      currentPlayer &&
      currentPlayer.combatSessionId &&
      this.characterBeingControlledByClient
    ) {
      this.characterBeingControlledByClient.combatSessionId =
        currentPlayer.combatSessionId;

      this.refreshCurrentPlayerCombatSessionsState(
        currentPlayer.combatSessionId
      );
    } else {
      // They are no longer in combat
      this.currentPlayersCombatTurn = false;
      this.currentPlayerSelectedEnemyToAttack = undefined;
      if (this.characterBeingControlledByClient) {
        this.characterBeingControlledByClient.combatSessionId = null;
      }
    }
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
          xPosition:
            location.location.position.xPosition -
            this.distanceBetweenCharacters,
          yPosition:
            location.location.position.yPosition +
            index * this.distanceBetweenCharacters,
        };
      });
    } else if (!locationHasEnemies && locationHasOtherPlayers) {
      location.players.forEach((player, index) => {
        player.position = {
          xPosition: location.location.position.xPosition,
          yPosition:
            location.location.position.yPosition +
            index * this.distanceBetweenCharacters,
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
          xPosition:
            location.location.position.xPosition +
            this.distanceBetweenCharacters,
          yPosition:
            location.location.position.yPosition +
            index * this.distanceBetweenCharacters,
        };
      });
    } else if (!locationHasPlayers && locationHasOtherEnemies) {
      location.enemies.forEach((enemy, index) => {
        enemy.position = {
          xPosition: location.location.position.xPosition,
          yPosition:
            location.location.position.yPosition +
            index * this.distanceBetweenCharacters,
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
        if (this.characterBeingControlledByClient?.combatSessionId) {
          this.refreshCurrentPlayerCombatSessionsState(
            this.characterBeingControlledByClient?.combatSessionId
          );
        }
      }
    });
  }

  public async spawnNpcRelativeToPlayer(
    npcType: NpcType,
    currentPlayer: Character
  ): Promise<Npc> {
    const npcData: NpcData = {
      id: '',
      npcType: npcType,
      currentLocation: currentPlayer.currentLocation,
      position: currentPlayer.currentLocation.position,
      directionFacing: this.#getDirectionFacingRelativeToPlayer(currentPlayer),
      // These are default stats
      npcStats: null,
      combatSessionID: null,
      weapons: [],
    };
    const newNpc: Npc = this.#npcFactory.createNpcObject(npcData);

    const answer = await this.#npcService.addNewNpcToGameSession(
      newNpc,
      this.gameSession.id
    );

    // Give the npc ID the id of the npc in the database
    newNpc.id = answer.id;

    return newNpc;
  }

  /**
   * Spawns multiple npcs of various types and quantities relative to the player's location.
   */
  public async spawnNpcsRelativeToPlayer(
    npcMapTypeToQuantity: Map<NpcType, number>,
    currentPlayer: Character
  ): Promise<Npc[]> {
    const npcsToSpawn: Npc[] = [];

    for (const [npcType, quantity] of npcMapTypeToQuantity.entries()) {
      for (let i = 0; i < quantity; i++) {
        const newNpc = await this.spawnNpcRelativeToPlayer(
          npcType,
          currentPlayer
        );
        npcsToSpawn.push(newNpc);
      }
    }

    return npcsToSpawn;
  }

  #getDirectionFacingRelativeToPlayer(
    currentPlayer: Character
  ): 'Right' | 'Left' {
    // If the player is facing right, the npc should face left and vice versa.
    return currentPlayer.directionFacing === 'Right' ? 'Left' : 'Right';
  }

  public checkIfPlayerLandedOnCombatSession(
    locationName: LocationKey
  ): string | null {
    const location = this.locationsWithPeopleOnThem.get(locationName);
    if (location) {
      if (location.enemies.length > 0 && location.players.length > 0) {
        return location.enemies[0].combatSessionID;
      }
    }
    return null;
  }

  public async endCombatAtLocation(locationName: LocationKey): Promise<void> {
    const location = this.locationsWithPeopleOnThem.get(locationName);
    if (location) {
      for (const enemy of location.enemies) {
        enemy.combatSessionID = null;

        // update the enemy in the database
        await this.#npcService.updateNpc(enemy, this.gameSession.id);
      }
    }
  }

  public checkIfPlayerIsInCombatSession(playerID: string): string | null {
    for (let combatSession of this.combatSessions.values()) {
      if (combatSession.playerIDs.includes(playerID)) {
        return combatSession.id;
      }
    }
    return null;
  }
}
