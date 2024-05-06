import { LocationNode } from '../services/location-service';
import { CardRewardType } from './card-reward-type';

export interface NPC {
  id: string;
  name: string;
  movementSpeed: number;
  inParty: boolean;
  currentLocation: LocationNode;
  directionFacing: 'Right' | 'Left';
  level: number;
  rewardTypeForDefeatingNpc: CardRewardType;
  experiencePointsForDefeatingNpc: number;
}
