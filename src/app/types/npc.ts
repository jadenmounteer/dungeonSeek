import { LocationNode } from '../services/location-service';
import { CardRewardType } from './card-reward-type';

export interface NPC {
  id: string; // The firebase id
  cardId: number; // The id of the card in the card deck. Used to fetch the info from the card deck
  npcStats: NPCStats;
}

export interface NPCCardInfo {
  cardId: number;
  name: string; // This is the identifier for the npc. It is used to fetch the npc from the card deck
  rightFacingImgUrl: string;
  leftFacingImgUrl: string;
  movementSpeed: number;
}

// These npc stats are added to the npc when it is created and set to the database.
// This is the info that is stored in the db. Everything else concerning the npc is fetched from JSON.
export interface NPCStats {
  rewardTypeForDefeatingNpc: CardRewardType;
  experiencePointsForDefeatingNpc: number;
  level: number;
  directionFacing: 'Right' | 'Left';
  currentLocation: LocationNode | null;
  inParty: boolean;
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  maxStamina: number;
  currentStamina: number;
}
