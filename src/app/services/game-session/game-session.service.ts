import { Injectable } from '@angular/core';
import { addDoc, collection } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  constructor(private firestore: Firestore) {}

  public async createNewGameSession(
    userID: string,
    gameName: string,
    campaign: string
  ): Promise<any> {
    // create a new game session
    const collectionRef = collection(this.firestore, 'game-sessions');

    const result = await addDoc(collectionRef, { userID, gameName, campaign });

    return result;
  }
}
