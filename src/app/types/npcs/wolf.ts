import { ArmorClass } from '../armor-class';
import { WeaponCardNames } from '../weapon-card-info';
import { Npc, NpcData } from './npc';

export class Wolf extends Npc {
  constructor(npcData: NpcData) {
    super(npcData);
    this.weapons = [WeaponCardNames.FANGS];
    this.rightFacingImgUrl = 'assets/game-pieces/wolf/wolf-right.png';
    this.leftFacingImgUrl = 'assets/game-pieces/wolf/wolf-left.png';
    this.npcStats = npcData.npcStats ?? {
      health: {
        current: 10,
        total: 10,
      },
      armorClass: ArmorClass.NONE,
    };
  }
}
