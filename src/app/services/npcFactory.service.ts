import { Injectable } from '@angular/core';
import { Bandit } from '../types/npcs/bandit';
import { NpcData, Npc, NpcType } from '../types/npcs/npc';
import { Wolf } from '../types/npcs/wolf';

@Injectable({
  providedIn: 'root',
})
export class NpcFactory {
  constructor() {}

  // TODO
  public createNpcObject(npcData: NpcData): Npc {
    switch (npcData.npcType) {
      case NpcType.BANDIT:
        return new Bandit(npcData);
      case NpcType.WOLF:
        return new Wolf(npcData);
      // Add cases for other NPC types...
      default:
        throw new Error(`Unsupported NPC type: ${npcData.npcType}`);
    }
  }
}
