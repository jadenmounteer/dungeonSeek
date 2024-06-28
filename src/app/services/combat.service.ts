import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CharacterService } from './character/character.service';
import { Npc } from '../types/npc';
import { NpcService } from './npc.service';

export interface CombatSession {
  playerIDs: string[];
  enemyIDs: string[];
  locationName: string;
}

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  #firestore: Firestore = inject(Firestore);
  private gameStateService: GameStateService = inject(GameStateService);
  private characterService: CharacterService = inject(CharacterService);
  private npcService: NpcService = inject(NpcService);

  constructor() {}

  public async startCombatSession(npcInCombat: Npc): Promise<void> {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client.');
    }

    // First, get the current player
    const currentPlayer =
      this.gameStateService.characterBeingControlledByClient;

    // Next, using their current location and the game state service, find the location with people on it object
    const locationName = currentPlayer?.currentLocation.name;
    if (!locationName) {
      throw new Error('No location name found for current player.');
    }

    const locationOfCombat =
      this.gameStateService.locationsWithPeopleOnThem.get(locationName);
    if (!locationOfCombat) {
      throw new Error(
        'No location with people on it found for current player.'
      );
    }

    // Create the combat session object with the current player and the enemies
    const combatSession: CombatSession = {
      playerIDs: locationOfCombat.players.map((player) => player.id),
      enemyIDs: locationOfCombat.enemies.map((enemy) => enemy.id),
      locationName: locationName,
    };

    // Save the combat session to the database
    const response = await this.addNewCombatSessionToDatabase(
      combatSession,
      this.gameStateService.gameSession.id
    );

    const combatSessionID = response.id;

    // Add the combat session ID to those who are involved in the combat
    this.gameStateService.characterBeingControlledByClient.combatSessionId =
      combatSessionID;
    this.characterService.updateCharacter(
      this.gameStateService.characterBeingControlledByClient,
      this.gameStateService.gameSession.id
    );

    npcInCombat.combatSessionID = combatSessionID;
    this.npcService.updateNpc(
      npcInCombat,
      this.gameStateService.gameSession.id
    );
  }

  private addNewCombatSessionToDatabase(
    combatSession: CombatSession,
    gameSessionID: string
  ): Promise<any> {
    const collectionRef = collection(
      this.#firestore,
      'game-sessions',
      gameSessionID,
      'combat-sessions'
    );

    return addDoc(collectionRef, combatSession).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  public getCombatSessionsInGameSession(
    gameSessionID: string
  ): Observable<CombatSession[]> {
    const collectionRef = collection(
      this.#firestore,
      'game-sessions',
      gameSessionID,
      'combat-sessions'
    );

    const listOfCombatSessions = collectionData(collectionRef, {
      idField: 'id',
    }) as Observable<CombatSession[]>;

    return listOfCombatSessions;
  }
}
