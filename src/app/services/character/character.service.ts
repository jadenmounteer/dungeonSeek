import { Injectable } from '@angular/core';
import { Character } from '../../types/character';
import {
  addDoc,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private firestore: Firestore) {}

  public getCharactersInGameSession(
    gameSessionId: string
  ): Observable<Character[]> {
    const collectionRef = collection(
      this.firestore,
      'game-sessions',
      gameSessionId,
      'characters'
    );

    return collectionData(collectionRef, {
      // This sets the id to the id of the document
      idField: 'id',
    }) as Observable<Character[]>;
  }
}
