import { Injectable } from '@angular/core';
import { Character } from '../../types/character';
import { addDoc, collection } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

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
}
