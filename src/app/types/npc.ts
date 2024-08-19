import { CombatSession } from '../services/combat.service';
import { LocationNode, Position } from '../services/location-service';
import { ArmorClass } from './armor-class';
import { CardRewardType } from './card-reward-type';
import { CharacterStat } from './character';
import { WeaponCardNames } from './weapon-card-info';

// This is the serialized data that is stored in the database
export interface NpcData {
  id: string; // The firebase id
  npcType: NpcType; // The id of the card in the card deck. Used to fetch the info from the card deck
  currentLocation: LocationNode;
  position: Position;
  directionFacing: 'Right' | 'Left';
  npcStats: NpcStats | null;
  combatSessionID: string | null; // Null if not in combat
  weapons: WeaponCardNames[]; // The weapons the npc can use to attack
}

// These npc stats are added to the npc when it is created and set to the database.
// This is the info that is stored in the db. Everything else concerning the npc is fetched from the class in the game.
export interface NpcStats {
  health: CharacterStat;
  armorClass: ArmorClass;
}

export enum NpcType {
  BANDIT = 'Bandit',
  GOBLIN = 'Goblin',
  ORC = 'Orc',
  OGRE = 'Ogre',
  GIANT = 'Giant',
  ZOMBIE = 'Zombie',
  SKELETON = 'Skeleton',
  VAMPIRE = 'Vampire',
  NECROMANCER = 'Necromancer',
}

export interface MinMax {
  min: number;
  max: number;
}

// The base npc class
// This is the base class for all npcs. It is abstract and should not be instantiated.
// The data that will be stored in the database is the data that is serialized and returned
export abstract class Npc {
  id: string = '';
  combatSessionID: string | null = null; // Null if not in combat
  npcType: NpcType;
  movementSpeed: number = 4;
  npcStats: NpcStats;
  currentLocation: LocationNode;
  position: Position;
  directionFacing: 'Right' | 'Left';
  rewardTypeForDefeatingNpc: CardRewardType = CardRewardType.EASY;
  public rightFacingImgUrl: string =
    'assets/game-pieces/bandit/bandit-right.png';
  public leftFacingImgUrl: string = 'assets/game-pieces/bandit/bandit-left.png';
  public weapons: WeaponCardNames[] = [WeaponCardNames.IRON_SWORD]; // The default weapon is an iron sword.

  constructor(npcData: NpcData) {
    this.npcType = npcData.npcType;
    this.npcStats = npcData.npcStats ?? {
      health: {
        current: 10,
        total: 10,
      },
      armorClass: 1,
    };
    this.currentLocation = npcData.currentLocation;
    this.position = npcData.position;
    this.directionFacing = npcData.directionFacing;
    this.id = npcData.id;
    this.combatSessionID = npcData.combatSessionID;
  }

  // Serializes the data to be stored in the database
  public serialize(): NpcData {
    return {
      id: this.id,
      npcType: this.npcType,
      npcStats: this.npcStats,
      currentLocation: this.currentLocation,
      position: this.position,
      directionFacing: this.directionFacing,
      combatSessionID: this.combatSessionID,
      weapons: this.weapons,
    };
  }

  /**
   * Define any common methods here. This way the behavior can change according to the npc type.
   */

  public choosePlayerToAttack(combatSession: CombatSession): string {
    // Create a list of all the playerIDs in the combat session
    const playerIDs = combatSession.playerIDs;
    // Randomly choose a playerID
    const randomIndex = Math.floor(Math.random() * playerIDs.length);
    return playerIDs[randomIndex];
  }

  public chooseWeaponToAttackWith(): WeaponCardNames {
    // Randomly choose a weapon to attack with
    const randomIndex = Math.floor(Math.random() * this.weapons.length);
    return this.weapons[randomIndex];
  }
}
