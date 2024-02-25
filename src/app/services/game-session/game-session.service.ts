import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
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

    const result = await addDoc(collectionRef, gameSession);

    return result;
  }

  public async fetchGameSessions(userID: string): Promise<GameSession[]> {
    const q = query(
      collection(this.firestore, 'game-sessions'),
      where('playerIDs', 'array-contains', userID)
    );

    const querySnapshot = await getDocs(q);
    let gameSessions: GameSession[] = [];
    querySnapshot.forEach((doc) => {
      const gameSession: Partial<GameSession> = {
        id: doc.id,
        ...doc.data(),
      };
      gameSessions.push(gameSession as GameSession);
    });
    return gameSessions;
  }
}
