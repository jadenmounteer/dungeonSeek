import { LocationNode } from '../services/location-service';
import { CardRewardType } from './card-reward-type';
import { CharacterStat } from './character';

export interface Npc {
  id: string; // The firebase id
  npcType: NpcType; // The id of the card in the card deck. Used to fetch the info from the card deck
  name: string; // The creator service generates the name based on the npcType. E.g. John the Bandit
  npcStats: NpcStats;
  currentLocation: LocationNode;
  level: number;
  inParty: boolean;
  directionFacing: 'Right' | 'Left';
  rewardTypeForDefeatingNpc: CardRewardType;
}

export interface NpcDisplayInfo {
  npcType: NpcType; // This is the identifier for the npc. It is used to fetch the npc from the card deck
  rightFacingImgUrl: string;
  leftFacingImgUrl: string;
  movementSpeed: number;
}

// These npc stats are added to the npc when it is created and set to the database.
// This is the info that is stored in the db. Everything else concerning the npc is fetched from JSON.
export interface NpcStats {
  health: CharacterStat;
  mana: CharacterStat;
  stamina: CharacterStat;
}

export enum NpcType {
  BANDIT = 'Bandit',
  GOBLIN = 'Goblin',
  ORC = 'Orc',
  OGRE = 'Ogre',
  GIANT = 'Giant',
}
