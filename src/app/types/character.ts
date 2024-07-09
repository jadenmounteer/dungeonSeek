import { LocationNode, Position } from '../services/location-service';

export interface Character {
  id: string;
  userId: string;
  name: string;
  class: CharacterClass;
  sex: CharacterSex;
  movementSpeed: number;
  currentLocation: LocationNode;
  position: Position;
  directionFacing: 'Right' | 'Left';
  level: number;
  characterStats: CharacterStats;
  characterMenu: CharacterMenu;
  gold: number;
  combatSessionId: string | null; // null if not in combat
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
  weaponCards: CharacterMenuEquipment[];
  itemCards: string[];
  spellCards: string[];
  statusCards: string[];
  sideQuestCards: string[];
  mainQuestCards: string[];
  // TODO add Armor cards
};

export type CharacterMenuEquipment = {
  cardName: string;
};

export type CharacterSex = 'Male' | 'Female';

export type CharacterClass = 'Sorcerer' | 'Pirate' | 'Viking';
