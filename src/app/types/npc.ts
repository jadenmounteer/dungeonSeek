import { LocationNode, Position } from '../services/location-service';
import { DeckName } from './card-deck';
import { CardRewardType } from './card-reward-type';
import { CharacterStat } from './character';

export interface Npc {
  id: string; // The firebase id
  npcType: NpcType; // The id of the card in the card deck. Used to fetch the info from the card deck
  name: string; // The creator service generates the name based on the npcType. E.g. John the Bandit
  deckName: DeckName; // The deck the npc belongs to. This will be important when we have multiple npc decks from different campaigns
  currentLocation: LocationNode;
  position: Position;
  inParty: boolean;
  directionFacing: 'Right' | 'Left';
  rewardTypeForDefeatingNpc: CardRewardType;
  movementSpeed: number;
  npcStats: NpcStats;
}

// This is the data that is stored in the json. It will not be stored in the db.
export interface NpcInfo {
  npcType: NpcType; // This is the identifier for the npc. It is used to fetch the npc from the card deck
  rightFacingImgUrl: string;
  leftFacingImgUrl: string;
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

const maleHumanNames = [
  'John',
  'Bob',
  'Billy',
  'Tom',
  'Tim',
  'Jim',
  'Joe',
  'Jack',
  'James',
  'Jake',
  'Hank',
  'Hector',
  'Hugo',
  'Homer',
  'Harry',
  'Henry',
  'Harold',
  'Harrison',
  'Frank',
  'Fred',
  'Finn',
  'Felix',
  'Floyd',
  'Fletcher',
  'Pete',
  'Paul',
  'Peter',
  'Zack',
  'Zane',
  'Zander',
  'Quinn',
  'Quincy',
  'Quentin',
  'Yuri',
  'Oscar',
  'Oliver',
  'Walter',
  'William',
  'Winston',
  'Victor',
  'Vincent',
  'Charles',
  'Christopher',
];

const maleOrcishNames = [
  'Gor',
  'Gorbad',
  'Gorbag',
  'Gorblag',
  'Gorblad',
  'Gorblud',
  'Crusher',
  'Smasher',
  'Basher',
  'Slasher',
  'Killer',
  'Hunter',
  'Gob',
  'Gobbo',
  'Gobbert',
  'Gobson',
  'Mongo',
  'Throg',
  'Grubber',
];

const maleGiantishNames = [
  'Gronk',
  'Grog',
  'Grug',
  'Mog',
  'Log',
  'Thog',
  'Throg',
  'Thrag',
  'Arg',
  'Nog',
  'Melgash',
  'Gorash',
  'Eggash',
  'Mogash',
  'Ragnor',
];

export const npcTypeToNameArray: Record<NpcType, string[]> = {
  [NpcType.BANDIT]: maleHumanNames,
  [NpcType.GOBLIN]: maleOrcishNames,
  [NpcType.ORC]: maleOrcishNames,
  [NpcType.OGRE]: maleGiantishNames,
  [NpcType.GIANT]: maleGiantishNames,
  [NpcType.ZOMBIE]: maleHumanNames,
  [NpcType.SKELETON]: maleHumanNames,
  [NpcType.VAMPIRE]: maleHumanNames,
  [NpcType.NECROMANCER]: maleHumanNames,
};

// TODO Tweak these numbers according to how tough the npc should be.
export const npcTypeToArmorClassArray: Record<NpcType, number> = {
  [NpcType.BANDIT]: 4,
  [NpcType.GOBLIN]: 1,
  [NpcType.ORC]: 14,
  [NpcType.OGRE]: 15,
  [NpcType.GIANT]: 16,
  [NpcType.ZOMBIE]: 8,
  [NpcType.SKELETON]: 10,
  [NpcType.VAMPIRE]: 15,
  [NpcType.NECROMANCER]: 12,
};

export const npcTypeToHealthArray: Record<NpcType, number> = {
  [NpcType.BANDIT]: 100,
  [NpcType.GOBLIN]: 50,
  [NpcType.ORC]: 100,
  [NpcType.OGRE]: 200,
  [NpcType.GIANT]: 500,
  [NpcType.ZOMBIE]: 80,
  [NpcType.SKELETON]: 80,
  [NpcType.VAMPIRE]: 100,
  [NpcType.NECROMANCER]: 100,
};

export interface MinMax {
  min: number;
  max: number;
}

export const npcDifficultyToLevel: Record<CardRewardType, MinMax> = {
  [CardRewardType.EASY]: { min: 1, max: 5 },
  [CardRewardType.MODERATE]: { min: 6, max: 11 },
  [CardRewardType.HARD]: { min: 11, max: 20 },
  [CardRewardType.INSANE]: { min: 20, max: 30 },
};
