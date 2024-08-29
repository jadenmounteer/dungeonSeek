import { Injectable, OnDestroy, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { CharacterService } from './character/character.service';
import { NpcService } from './npc.service';
import { WeaponCardInfo } from '../types/weapon-card-info';
import { DiceRollDialogueService } from './dice-roll-dialogue.service';
import { Character } from '../types/character';
import { WeaponCardService } from './weapon-card.service';
import { Npc } from '../types/npcs/npc';
import { CardRewardType } from '../types/card-reward-type';
import { LootService } from './loot.service';

export interface CombatSession {
  id: string;
  playerIDs: string[];
  enemyIDs: string[];
  locationName: string;
  turnQueue: string[];
  lootType: CardRewardType; // The reward type the person who wins the combat session will get. The person who dealt the killing blow gets the loot.
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
  private weaponCardService: WeaponCardService = inject(WeaponCardService);
  private lootService: LootService = inject(LootService);

  public npcDealtDamageToCurrentPlayer$: Subject<number> =
    new Subject<number>();

  private dealDamageToNPCSub =
    this.diceRollDialogueService.dealDamageToNPCSub.subscribe(
      async (result) => {
        await this.dealDamageToNpc(result);
        await this.endCurrentTurn();
        if (this.combatShouldEnd()) {
          await this.endCombatSessionPlayerVictory();
        }
      }
    );

  // Defined if currently attacking with a weapon.
  private weaponInfo: WeaponCardInfo | undefined;

  constructor() {}

  ngOnDestroy(): void {
    this.dealDamageToNPCSub.unsubscribe();
  }

  private async endCombatSessionPlayerVictory(): Promise<void> {
    // Get the combatSession ID
    const combatSessionID =
      this.gameStateService.characterBeingControlledByClient?.combatSessionId;

    if (!combatSessionID) {
      throw new Error('No combat session ID found.');
    }

    // Get the combat session
    const combatSession =
      this.gameStateService.combatSessions.get(combatSessionID);

    // Remove the combat session ID from all players participating
    if (this.gameStateService.characterBeingControlledByClient) {
      this.gameStateService.characterBeingControlledByClient.combatSessionId =
        null;
    }
    combatSession?.playerIDs.forEach((playerID) => {
      const player =
        this.gameStateService.allCharactersCurrentlyInGameSession.find(
          (character) => character.id === playerID
        );
      if (!player) {
        throw new Error('No player found.');
      }

      player.combatSessionId = null;
      this.characterService.updateCharacter(
        player,
        this.gameStateService.gameSession.id
      );
    });

    await this.removeCombatSessionFromDatabase(
      combatSessionID,
      this.gameStateService.gameSession.id
    );

    combatSession?.playerIDs.forEach(async (playerId) => {
      const player =
        this.gameStateService.allCharactersCurrentlyInGameSession.find(
          (character) => character.id === playerId
        );

      if (!player) {
        throw new Error('No player found.');
      }

      // If the player is the current player being controlled, show them a dialogue box with the reward they received.
      if (
        player.id === this.gameStateService.characterBeingControlledByClient?.id
      ) {
        // We don't update the db here because we update it when they pick a loot card.
        this.lootService.drawLootCard(combatSession.lootType);
      }
    });
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

  private async endCurrentTurn(): Promise<void> {
    this.gameStateService.currentPlayerSelectedEnemyToAttack = undefined;
    this.gameStateService.currentPlayersCombatTurn = false;
    this.gameStateService.npcCombatMessage = '';
    this.gameStateService.npcCombatTurn = false;

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
    const combatentID = combatSession.turnQueue.shift();

    if (!combatentID) {
      throw new Error('No player ID found.');
    }

    // Put the ID of at the end of the queue so they go last
    combatSession.turnQueue.push(combatentID);

    // Remove any dead players or NPCs from turn queue
    combatSession.turnQueue = this.filterOutDeadPlayersAndNPCs(combatSession);

    // Save changes to db
    await this.updateCombatSessionInDatabase(
      combatSession,
      this.gameStateService.gameSession.id
    );
  }

  private filterOutDeadPlayersAndNPCs(combatSession: CombatSession): string[] {
    const filteredTurnQueue = combatSession.turnQueue.filter((id) => {
      if (combatSession.playerIDs.includes(id)) {
        const player =
          this.gameStateService.allCharactersCurrentlyInGameSession.find(
            (character) => character.id === id
          );

        if (!player) {
          throw new Error('No player found.');
        }

        if (player?.characterStats.health.current > 0) {
          return true;
        } else {
          return false;
        }
      } else if (combatSession.enemyIDs.includes(id)) {
        const npc = this.gameStateService.npcsInPlay.find(
          (npc) => npc.id === id
        );

        if (!npc) {
          throw new Error('No npc found.');
        }

        if (npc?.npcStats.health.current > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });

    return filteredTurnQueue;
  }

  public initializeCombatSessionTurnQueue(
    combatSession: CombatSession
  ): string[] {
    // TODO For not this just inserts them in the order they are in the array. In the future I can add initiative or sneak or whatever.
    return combatSession.playerIDs.concat(...combatSession.enemyIDs);
  }

  public async addCharacterToCombatSession(combatSessionID: string) {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client.');
    }

    // Get the combat session
    const combatSession =
      this.gameStateService.combatSessions.get(combatSessionID);

    if (!combatSession) {
      throw new Error('No combat session found.');
    }

    // Add the character to the combat session
    combatSession.playerIDs.push(
      this.gameStateService.characterBeingControlledByClient.id
    );

    // Add the character to the turn queue
    combatSession.turnQueue.push(
      this.gameStateService.characterBeingControlledByClient.id
    );

    // Update the combat session
    await this.updateCombatSessionInDatabase(
      combatSession,
      this.gameStateService.gameSession.id
    );
  }

  public async startCombatSession(
    npcsInCombat: Npc[],
    lootType: CardRewardType
  ): Promise<void> {
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
      lootType: lootType,
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

    combatSession.playerIDs.forEach((playerID) => {
      const player =
        this.gameStateService.allCharactersCurrentlyInGameSession.find(
          (character) => character.id === playerID
        );
      if (!player) {
        throw new Error('No player found.');
      }

      player.combatSessionId = combatSessionID;
      this.characterService.updateCharacter(
        player,
        this.gameStateService.gameSession.id
      );
    });

    npcsInCombat.forEach((npc) => {
      npc.combatSessionID = combatSessionID;
      this.npcService.updateNpc(npc, this.gameStateService.gameSession.id);
    });
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

  private async removeCombatSessionFromDatabase(
    combatSessionID: string,
    gameSessionID: string
  ): Promise<void> {
    const docRef = doc(
      collection(
        this.#firestore,
        'game-sessions',
        gameSessionID,
        'combat-sessions'
      ),
      combatSessionID
    );

    return deleteDoc(docRef);
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

    // If the NPC is dead, give the player who dealt the blow experience points
    if (npcToAttack.npcStats.health.current <= 0) {
      currentPlayer.characterStats.experience.current +=
        npcToAttack.experiencePointsForDefeating;
    }

    await this.characterService.updateCharacter(
      currentPlayer,
      this.gameStateService.gameSession.id
    );

    // They just attacked, so they are no longer attacking with this weapon.
    this.weaponInfo = undefined;
  }

  // TODO Make sure this method is not called more than once. If it is, we can set a property in the state service for npc currently taking a turn and not call this method twice.
  public async takeNPCTurn(npc: Npc): Promise<void> {
    // SetTimeout to simulate the NPC thinking about what to do.
    setTimeout(() => {
      // Get the current comnbat session
      const combatSessionID = npc.combatSessionID;

      if (!combatSessionID) {
        throw new Error('No combat session ID found.');
      }

      const combatSession =
        this.gameStateService.combatSessions.get(combatSessionID);

      if (!combatSession) {
        throw new Error('No combat session found.');
      }

      // TODO this method can probably be moved to the base npc class.
      const characterIdToAttack = npc.choosePlayerToAttack(combatSession);

      // Decide which action to take.
      const weaponToAttackWith = npc.chooseWeaponToAttackWith();

      const characterBeingAttacked =
        this.gameStateService.allCharactersCurrentlyInGameSession.find(
          (character) => character.id === characterIdToAttack
        );

      this.gameStateService.npcCombatMessage = `${npc.npcType} is attacking ${characterBeingAttacked?.name} with ${weaponToAttackWith}`;

      // NPC attacks player.
      const weaponCardInfo =
        this.weaponCardService.getCardInfo(weaponToAttackWith);

      if (!weaponCardInfo) {
        throw new Error(`No weapon card info found for ${weaponToAttackWith}`);
      }

      const damageRolled = npc.rollForDamage(weaponCardInfo);

      setTimeout(async () => {
        await this.dealDamageToPlayer(
          damageRolled,
          characterBeingAttacked?.armorClass ?? 1,
          characterBeingAttacked!,
          npc.npcType
        );

        setTimeout(async () => {
          await this.endCurrentTurn();
        }, 3000);
      }, 3000);

      // NPC ends turn.
    }, 3000);
  }

  private async dealDamageToPlayer(
    damageRolled: number,
    playerArmorClass: number,
    characterToAttack: Character,
    npcName: string
  ): Promise<void> {
    // Calculate the damage dealt
    let damageDealt = damageRolled - playerArmorClass;

    // Always deal at least 1 point of damage
    if (damageDealt < 1) {
      damageDealt = 1;
    }

    this.gameStateService.npcCombatMessage = `${npcName} dealt ${damageDealt} damage to ${characterToAttack.name}!`;

    characterToAttack.characterStats.health.current -= damageDealt;

    await this.characterService.updateCharacter(
      characterToAttack,
      this.gameStateService.gameSession.id
    );

    // Update the UI
    // We use a subject so we don't have to make another backend call to update the UI.
    this.npcDealtDamageToCurrentPlayer$.next(damageDealt);
  }
}
