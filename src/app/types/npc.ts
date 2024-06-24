import { LocationNode, Position } from '../services/location-service';
import { CardRewardType } from './card-reward-type';
import { CharacterStat } from './character';

// This is the serialized data that is stored in the database
export interface NpcData {
  id: string; // The firebase id
  npcType: NpcType; // The id of the card in the card deck. Used to fetch the info from the card deck
  currentLocation: LocationNode;
  position: Position;
  directionFacing: 'Right' | 'Left';
  npcStats: NpcStats | null;
}

// These npc stats are added to the npc when it is created and set to the database.
// This is the info that is stored in the db. Everything else concerning the npc is fetched from JSON.
export interface NpcStats {
  health: CharacterStat;
  armorClass: number;
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
  npcType: NpcType;
  movementSpeed: number = 4;
  npcStats: NpcStats | null = null;
  currentLocation: LocationNode;
  position: Position;
  inParty: boolean = false;
  directionFacing: 'Right' | 'Left';
  rewardTypeForDefeatingNpc: CardRewardType = CardRewardType.EASY;
  public rightFacingImgUrl: string =
    'assets/game-pieces/bandit/bandit-right.png';
  public leftFacingImgUrl: string = 'assets/game-pieces/bandit/bandit-left.png';

  constructor(npcData: NpcData) {
    this.npcType = npcData.npcType;
    this.npcStats = npcData.npcStats;
    this.currentLocation = npcData.currentLocation;
    this.position = npcData.position;
    this.directionFacing = npcData.directionFacing;
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
    };
  }

  // Define any common methods here
}
