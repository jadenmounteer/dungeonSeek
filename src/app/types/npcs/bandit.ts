import { ArmorClass } from '../armor-class';
import { CardRewardType } from '../card-reward-type';
import { Npc, NpcData } from './npc';

export class Bandit extends Npc {
  constructor(npcData: NpcData) {
    super(npcData);
    this.rewardTypeForDefeatingNpc = CardRewardType.EASY;
    this.rightFacingImgUrl = 'assets/game-pieces/bandit/bandit-right.png';
    this.leftFacingImgUrl = 'assets/game-pieces/bandit/bandit-left.png';
    this.npcStats = npcData.npcStats ?? {
      health: {
        current: 1,
        total: 1,
      },
      armorClass: ArmorClass.LIGHT,
    };
  }
}
