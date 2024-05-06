import { Injectable, inject } from '@angular/core';
import { NPC } from '../types/npc';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  #firestore = inject(Firestore);

  #npcs: NPC[] = [];

  constructor() {}

  public createNpc(npc: NPC): void {
    this.#npcs.push(npc);
  }

  public getNpcs(): NPC[] {
    return this.#npcs;
  }

  public addNpcToGameSession(gameSessionId: string, newNpc: NPC): Promise<any> {
    const collectionRef = collection(
      this.#firestore,
      'game-sessions',
      gameSessionId,
      'npcs'
    );

    return addDoc(collectionRef, newNpc);
  }
}
