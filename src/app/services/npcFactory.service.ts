import { Injectable } from '@angular/core';
import { Npc, NpcData, NpcType } from '../types/npc';

import { BanditNpc } from '../types/bandit-npc-data';

@Injectable({
  providedIn: 'root',
})
export class NpcFactory {
  constructor() {}

  // TODO
  public createNpcObject(npcData: NpcData): Npc {
    switch (npcData.npcType) {
      case NpcType.BANDIT:
        return new BanditNpc(npcData);
      // Add cases for other NPC types...
      default:
        throw new Error(`Unsupported NPC type: ${npcData.npcType}`);
    }
  }
}
