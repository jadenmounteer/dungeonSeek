import { Injectable } from '@angular/core';
import { Character } from '../../types/character';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  query,
  updateDoc,
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

  public updateCharacter(
    character: Character,
    gameSessionID: string
  ): Promise<any> {
    // reference the character within the game session
    const docRef = doc(
      collection(this.firestore, 'game-sessions', gameSessionID, 'characters'),
      character.id
    );

    return updateDoc(docRef, { ...character });
  }

  public getClientCharacters(
    allCharacters: Character[],
    userID: string | undefined
  ): Character[] {
    return allCharacters.filter((character) => {
      return character.userId === userID;
    });
  }
}
