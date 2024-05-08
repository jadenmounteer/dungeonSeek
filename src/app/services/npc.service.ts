import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Npc } from '../types/npc';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  #firestore: Firestore = inject(Firestore);

  constructor() {}

  public getNPCsInGameSession(gameSessionID: string): Observable<Npc[]> {
    const collectionRef = collection(
      this.#firestore,
      'game-sessions',
      gameSessionID,
      'npcs'
    );

    return collectionData(collectionRef, {
      // This sets the id to the id of the document
      idField: 'id',
    }) as Observable<Npc[]>;
  }
}
