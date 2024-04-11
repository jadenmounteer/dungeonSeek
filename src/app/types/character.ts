import { Position, LocationNode } from '../services/location-service';

export interface Character {
  id: string;
  userId: string;
  name: string;
  class: CharacterClass;
  sex: CharacterSex;
  movementSpeed: number;
  inParty: boolean;
  currentLocation: LocationNode;
  directionFacing: 'Right' | 'Left';
  level: number;
  characterStats: CharacterStats;
  characterMenu: CharacterMenu;
  gold: number;
}

export type CharacterStats = {
  health: CharacterStat;
  mana: CharacterStat;
  stamina: CharacterStat;
  experience: CharacterStat;
};

export type CharacterStat = {
  total: number;
  current: number;
};

export type CharacterMenu = {
  weaponCards: [];
  itemCards: [];
  spellCards: [];
  statusCards: [];
  sideQuestCards: [];
  mainQuestCards: [];
};

export type CharacterSex = 'Male' | 'Female';

export type CharacterClass = 'Sorcerer' | 'Pirate' | 'Rogue' | 'Viking';
