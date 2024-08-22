import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { NpcFactory } from './npcFactory.service';
import { Npc, NpcData } from '../types/npcs/npc';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  #firestore: Firestore = inject(Firestore);
  private npcFactory: NpcFactory = inject(NpcFactory);

  constructor() {}

  public updateNpc(npc: Npc, gameSessionID: string): Promise<any> {
    const serializedData = npc.serialize();

    const docRef = doc(
      collection(this.#firestore, 'game-sessions', gameSessionID, 'npcs'),
      npc.id
    );

    return updateDoc(docRef, { ...serializedData }).catch((error) => {
      console.error('Error updating document: ', error);
    });
  }

  public async removeAllDeadNPCsFromGame(
    npcsInPlay: Npc[],
    gameSessionID: string
  ): Promise<void> {
    const deadNpcs: Npc[] = npcsInPlay.filter(
      (npc) => npc.npcStats.health.current <= 0
    );

    if (deadNpcs) {
      deadNpcs.forEach(async (npc) => {
        await this.deleteNpc(npc, gameSessionID);
      });
    }
  }

  public deleteNpc(npc: Npc, gameSessionID: string): Promise<any> {
    const docRef = doc(
      collection(this.#firestore, 'game-sessions', gameSessionID, 'npcs'),
      npc.id
    );

    return deleteDoc(docRef);
  }

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
