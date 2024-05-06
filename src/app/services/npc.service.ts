import { Injectable } from '@angular/core';
import { NPC } from '../types/npc';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  #npcs: NPC[] = [];

  constructor() {}

  public createNpc(npc: NPC): void {
    this.#npcs.push(npc);
  }

  public getNpcs(): NPC[] {
    return this.#npcs;
  }
}
