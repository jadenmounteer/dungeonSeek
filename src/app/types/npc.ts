import { LocationNode, Position } from '../services/location-service';
import { DeckName } from './card-deck';
import { CardRewardType } from './card-reward-type';
import { CharacterStat } from './character';

export interface Npc {
  id: string; // The firebase id
  npcType: NpcType; // The id of the card in the card deck. Used to fetch the info from the card deck
  name: string; // The creator service generates the name based on the npcType. E.g. John the Bandit
  deckName: DeckName; // The deck the npc belongs to. This will be important when we have multiple npc decks from different campaigns
  npcStats: NpcStats;
  currentLocation: LocationNode;
  position: Position;
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
