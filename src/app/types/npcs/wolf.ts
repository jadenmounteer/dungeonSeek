import { ArmorClass } from '../armor-class';
import { Npc, NpcData } from './npc';

export class Wolf extends Npc {
  constructor(npcData: NpcData) {
    super(npcData);

    this.rightFacingImgUrl = 'assets/game-pieces/wolf/wolf-right.png';
    this.leftFacingImgUrl = 'assets/game-pieces/wolf/wolf-left.png';
    this.npcStats = npcData.npcStats ?? {
      health: {
        current: 1,
        total: 10,
      },
      armorClass: ArmorClass.NONE,
    };
  }
}
