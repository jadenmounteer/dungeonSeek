import { Position, LocationNode } from '../services/location-service';

export interface Character {
  id: string;
  userId: string;
  name: string;
  class: CharacterClass;
  sex: 'Male' | 'Female';
  level: number;
  movementSpeed: number;
  inParty: boolean;
  currentLocation: LocationNode;
  directionFacing: 'Right' | 'Left';
  equipmentCards: []; // TODO type all these things
  potionCards: [];
  itemCards: [];
  spellCards: [];
  statusCards: [];
  health: number;
  mana: number;
  experience: number;
  gold: number;
}

export type CharacterClass = 'Sorcerer';
