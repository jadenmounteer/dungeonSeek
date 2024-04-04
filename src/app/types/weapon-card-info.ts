import { CardAbilityKey } from './card-ability';
import { CardRewardType } from './card-reward-type';

export interface WeaponCardInfo {
  name: string;
  description: string;
  imgUrl: string;
  type: WeaponCardType;
  fullPrice: number; // If everyone was honest in Tesslandia, they would pay this price. You'll be lucky if you get 20% of this price when selling. Shopkeepers are greedy.
  rewardType: CardRewardType;
  discardAfterUse: boolean;
  quantity: number; // Magical weapons were forged by sorcerers long ago and cannot be replicated. There are only a few in existence.
  stats: WeaponCardStats;
  cardAbility: CardAbilityKey;
}

export type WeaponCardType = 'Sword' | 'Bow' | 'Staff' | 'Shield';

export interface WeaponCardStats {
  attack: number;
  defense: number;
  speed: number;
}
