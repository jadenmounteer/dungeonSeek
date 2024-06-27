import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Character } from '../types/character';
import { Npc } from '../types/npc';

export interface CombatSession {
  players: Character[];
  enemies: Npc[];
  locationName: string;
}

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  private gameStateService: GameStateService = inject(GameStateService);

  constructor() {}

  public startCombatSession(): void {
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
      players: locationOfCombat.players,
      enemies: locationOfCombat.enemies,
      locationName: locationName,
    };

    console.log('Combat session: ', combatSession);

    // Save the combat session to the database
  }
}
