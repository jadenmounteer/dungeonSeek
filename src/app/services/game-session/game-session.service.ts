import { Injectable } from '@angular/core';
import { addDoc, collection } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { GameSession } from '../../types/game-session';

@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  constructor(private firestore: Firestore) {}

  public async createNewGameSession(gameSession: GameSession): Promise<any> {
    // create a new game session
    const collectionRef = collection(this.firestore, 'game-sessions');

    const result = await addDoc(collectionRef, { gameSession });

    return result;
  }

  private fetchGameSessions(): void {}
}
