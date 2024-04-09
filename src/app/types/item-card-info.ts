import { ActionCardAbilityKey } from './card-ability';
import { CardRewardType } from './card-reward-type';

// Items are things like magic potions or poisons, scrolls, food, lock picks, etc.
export interface ItemCardInfo {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  fullPrice: number;
  type: ItemCardType;
  rewardType: CardRewardType;
  discardAfterUse: boolean; // Discard the item after drawing it from the deck. For example, will it be put back into the deck?
  quantity: number; // This is the number of times the item appears in the deck
  stats: ItemCardStats;
  cardAbility: ActionCardAbilityKey | null;
}

export interface ItemCardStats {
  health: number; // The number to add or remove from your health
  attack: number; // The number to add or remove from your attack
  defense: number; // The number to add or remove from your defense
  speed: number; // The number to add or remove from your speed
  mana: number; // The number to add or remove from your mana
}

export type ItemCardType =
  | 'Potion'
  | 'Poison'
  | 'Scroll'
  | 'Trap'
  | 'Lock Pick'
  | 'Bread';
