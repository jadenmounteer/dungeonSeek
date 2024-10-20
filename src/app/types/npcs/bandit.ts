import { ArmorClass } from '../armor-class';
import { Npc, NpcData } from './npc';

export class Bandit extends Npc {
  constructor(npcData: NpcData) {
    super(npcData);

    this.rightFacingImgUrl = 'assets/game-pieces/bandit/bandit-right.png';
    this.leftFacingImgUrl = 'assets/game-pieces/bandit/bandit-left.png';
    this.npcStats = npcData.npcStats ?? {
      health: {
        current: 1,
        total: 10,
      },
      armorClass: ArmorClass.LIGHT,
    };
  }
}
