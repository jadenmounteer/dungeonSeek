import { Injectable, OnDestroy, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CharacterService } from './character/character.service';
import { Npc } from '../types/npc';
import { NpcService } from './npc.service';
import { WeaponCardInfo } from '../types/weapon-card-info';
import { DiceRollDialogueService } from './dice-roll-dialogue.service';

export interface CombatSession {
  id: string;
  playerIDs: string[];
  enemyIDs: string[];
  locationName: string;
  turnQueue: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CombatService implements OnDestroy {
  #firestore: Firestore = inject(Firestore);
  private gameStateService: GameStateService = inject(GameStateService);
  private diceRollDialogueService: DiceRollDialogueService = inject(
    DiceRollDialogueService
  );
  private characterService: CharacterService = inject(CharacterService);
  private npcService: NpcService = inject(NpcService);

  private dealDamageToNPCSub =
    this.diceRollDialogueService.dealDamageToNPCSub.subscribe(
      async (result) => {
        await this.dealDamageToNpc(result);
        await this.endPlayerTurn();
        if (this.combatShouldEnd()) {
          // TODO end combat session
        } else {
          await this.startNextTurn();
        }
      }
    );

  // Defined if currently attacking with a weapon.
  private weaponInfo: WeaponCardInfo | undefined;

  constructor() {}

  ngOnDestroy(): void {
    this.dealDamageToNPCSub.unsubscribe();
  }

  private combatShouldEnd(): boolean {
    let allEnemiesDead = true;
    let allPlayersDead = true;

    // First, get the combat session
    const combatSessionID =
      this.gameStateService.characterBeingControlledByClient?.combatSessionId;

    if (!combatSessionID) {
      throw new Error('No combat session ID found.');
    }

    const combatSession =
      this.gameStateService.combatSessions.get(combatSessionID);

    // If all enemies are dead, combat should end
    combatSession?.enemyIDs.forEach((enemyId) => {
      const enemy = this.gameStateService.npcsInPlay.find(
        (npc) => npc.id === enemyId
      );
      const enemyHealth = enemy?.npcStats?.health?.current ?? 0;
      if (enemyHealth > 0) {
        allEnemiesDead = false;
      }
    });

    if (allEnemiesDead) {
      return true;
    }

    // If all players are dead, combat should end
    combatSession?.playerIDs.forEach((playerId) => {
      const player =
        this.gameStateService.allCharactersCurrentlyInGameSession.find(
          (character) => character.id === playerId
        );
      const playerHealth = player?.characterStats?.health?.current ?? 0;
      if (playerHealth > 0) {
        allPlayersDead = false;
      }
    });

    if (allPlayersDead) {
      return true;
    } else {
      return false;
    }
  }

  private async endPlayerTurn(): Promise<void> {
    this.gameStateService.currentPlayerSelectedEnemyToAttack = undefined;
    this.gameStateService.currentPlayersCombatTurn = false;

    // Update the turn queue
    const combatSessionID =
      this.gameStateService.characterBeingControlledByClient?.combatSessionId;

    if (!combatSessionID) {
      throw new Error('No combat session ID found.');
    }

    const combatSession =
      this.gameStateService.combatSessions.get(combatSessionID);

    if (!combatSession) {
      throw new Error('No combat session found.');
    }

    // Get the ID of the current player
    const playerID = combatSession.turnQueue.shift();

    if (!playerID) {
      throw new Error('No player ID found.');
    }

    // Save changes to db
    await this.updateCombatSessionInDatabase(
      combatSession,
      this.gameStateService.gameSession.id
    );
  }

  private async startNextTurn(): Promise<void> {
    // First, get the combat session
    const combatSessionID =
      this.gameStateService.characterBeingControlledByClient?.combatSessionId;

    if (!combatSessionID) {
      throw new Error('No combat session ID found.');
    }

    const combatSession =
      this.gameStateService.combatSessions.get(combatSessionID);

    if (!combatSession) {
      throw new Error('No combat session found.');
    }

    // Get the ID to go
    const nextID = combatSession.turnQueue.shift();

    if (!nextID) {
      throw new Error('No next ID found.');
    }

    // Put the ID of at the end of the queue so they go last
    combatSession?.turnQueue.push(nextID);

    const nextEnemy = this.gameStateService.npcsInPlay.find(
      (npc) => npc.id === nextID
    );

    await this.updateCombatSessionInDatabase(
      combatSession,
      this.gameStateService.gameSession.id
    );

    if (nextEnemy) {
      // TODO Start an enemy turn
      alert("It's the enemy's turn!");
    } else {
      alert("It's the player's turn!");
      const nextCharacter =
        this.gameStateService.allCharactersCurrentlyInGameSession.find(
          (character) => character.id === nextID
        );

      // TODO Start a character's turn
    }
  }

  public initializeCombatSessionTurnQueue(
    combatSession: CombatSession
  ): string[] {
    // TODO For not this just inserts them in the order they are in the array. In the future I can add initiative or sneak or whatever.
    return combatSession.playerIDs.concat(...combatSession.enemyIDs);
  }

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
      id: '',
      playerIDs: locationOfCombat.players.map((player) => player.id),
      enemyIDs: locationOfCombat.enemies.map((enemy) => enemy.id),
      locationName: locationName,
      turnQueue: [],
    };

    combatSession.turnQueue =
      this.initializeCombatSessionTurnQueue(combatSession);

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

  private async updateCombatSessionInDatabase(
    combatSession: CombatSession,
    gameSessionID: string
  ): Promise<void> {
    const docRef = doc(
      collection(
        this.#firestore,
        'game-sessions',
        gameSessionID,
        'combat-sessions'
      ),
      combatSession.id
    );

    return updateDoc(docRef, { ...combatSession });
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

  public selectNpcToAttack(npc: Npc): void {
    this.gameStateService.currentPlayerSelectedEnemyToAttack = npc;
  }

  public attackWithWeapon(event: any): void {
    this.weaponInfo = event.weaponInfo as WeaponCardInfo;
    const npcToAttack =
      this.gameStateService.currentPlayerSelectedEnemyToAttack;

    if (!npcToAttack) {
      throw new Error('NPC to attack is undefined.');
    }

    // Roll for damage
    this.diceRollDialogueService.rollForDamage(this.weaponInfo, npcToAttack);
  }

  private async dealDamageToNpc(damageRolled: number): Promise<void> {
    const npcArmorClass =
      this.gameStateService.currentPlayerSelectedEnemyToAttack?.npcStats
        .armorClass ?? 1;

    // Calculate the damage dealt
    let damageDealt = damageRolled - npcArmorClass;

    // Always deal at least 1 point of damage
    if (damageDealt < 1) {
      damageDealt = 1;
    }

    // Update the npc
    const npcToAttack =
      this.gameStateService.currentPlayerSelectedEnemyToAttack;

    if (!npcToAttack) {
      throw new Error('npcToAttack is undefined.');
    }

    // FIXME come up with a better system for displaying messages
    alert(
      'You dealt ' + damageDealt + ' damage to the ' + npcToAttack.npcType + '!'
    );

    npcToAttack.npcStats.health.current -= damageDealt;

    await this.npcService.updateNpc(
      npcToAttack,
      this.gameStateService.gameSession.id
    );

    // Update the current character's stats
    const currentPlayer =
      this.gameStateService.characterBeingControlledByClient;
    if (!currentPlayer || !this.weaponInfo) {
      throw new Error('currentPlayer or weaponInfo is undefined.');
    }

    currentPlayer.characterStats.health.current -=
      this.weaponInfo.stats.costToUse.healthCost;
    currentPlayer.characterStats.mana.current -=
      this.weaponInfo.stats.costToUse.manaCost;
    currentPlayer.characterStats.stamina.current -=
      this.weaponInfo.stats.costToUse.staminaCost;

    await this.characterService.updateCharacter(
      currentPlayer,
      this.gameStateService.gameSession.id
    );

    // They just attacked, so they are no longer attacking with this weapon.
    this.weaponInfo = undefined;
  }
}
