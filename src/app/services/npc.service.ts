import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Npc, NpcData } from '../types/npc';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { NpcFactory } from './npcFactory.service';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  #firestore: Firestore = inject(Firestore);
  private npcFactory: NpcFactory = inject(NpcFactory);

  constructor() {}

  public getNPCsInGameSession(gameSessionID: string): Observable<Npc[]> {
    const collectionRef = collection(
      this.#firestore,
      'game-sessions',
      gameSessionID,
      'npcs'
    );

    const listOfNpcData = collectionData(collectionRef, {
      // This sets the id to the id of the document
      idField: 'id',
    }) as Observable<Npc[]>;

    return listOfNpcData.pipe(
      map((npcsData) =>
        npcsData.map((npcData) => this.deserializeNpcData(npcData))
      )
    );
  }

  public addNewNpcToGameSession(npc: Npc, gameSessionID: string): Promise<any> {
    const serializedData = npc.serialize();

    const collectionRef = collection(
      this.#firestore,
      'game-sessions',
      gameSessionID,
      'npcs'
    );

    return addDoc(collectionRef, serializedData).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  public deserializeNpcData(data: NpcData): Npc {
    return this.npcFactory.createNpcObject(data);
  }
}
