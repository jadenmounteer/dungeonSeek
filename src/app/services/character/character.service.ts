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

  public async createNewCharacter(character: Character): Promise<any> {
    // create a new game session
    const collectionRef = collection(this.firestore, 'characters');

    const result = await addDoc(collectionRef, character);

    return result;
  }

  public getCharactersInGameSession(
    listOfCharacterIds: string[]
  ): Observable<any> {
    const q = query(
      collection(this.firestore, 'characters'),
      where('id', 'in', listOfCharacterIds)
    );
    const characters = collectionData(q, { idField: 'id' });
    return characters;
  }
}
