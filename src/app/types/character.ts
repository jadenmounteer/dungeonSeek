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
}

export type CharacterStats = {
  health: number;
  mana: number;
  stamina: number;
  experience: number;
  gold: number;
};

export type CharacterMenu = {
  equipmentCards: []; // TODO type all these things
  potionCards: [];
  itemCards: [];
  spellCards: [];
  statusCards: [];
  sideQuestCards: [];
};

export type CharacterSex = 'Male' | 'Female';

export type CharacterClass = 'Sorcerer' | 'Pirate' | 'Rogue' | 'Viking';
