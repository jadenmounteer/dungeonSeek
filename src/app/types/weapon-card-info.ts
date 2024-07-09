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
  quantity: number; // Magical weapons were forged by the sorcerers of old and the knowledge has been lost. There are only a few in existence.
  stats: WeaponCardStats;
  cardAbility: CardAbilityKey | null;
}

export type WeaponCardType = 'Sword' | 'Bow' | 'Staff';

export interface WeaponCardStats {
  attack: number;
  defense: number;
  speed: number;
}

export enum WeaponCardNames {
  SWORD_OF_BANISHMENT = 'Sword of Banishment',
  SWORD_OF_THE_ANCIENTS = 'Sword of the Ancients',
  IRON_SWORD = 'Iron Sword',
}
