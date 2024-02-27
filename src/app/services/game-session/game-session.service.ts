import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { GameSession } from '../../types/game-session';
import { Observable, lastValueFrom, of } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  private activeUsersSessionsQuery = query(
    collection(this.firestore, 'game-sessions'),
    where('playerIDs', 'array-contains', this.authService.activeUser!.uid)
  );

  public usersGameSessions$: Observable<GameSession[]> = collectionData(
    this.activeUsersSessionsQuery,
    {
      // This sets the id to the id of the document
      idField: 'id',
    }
  ) as Observable<GameSession[]>;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  public async createNewGameSession(gameSession: GameSession): Promise<any> {
    // create a new game session
    const collectionRef = collection(this.firestore, 'game-sessions');

    const result = await addDoc(collectionRef, gameSession);

    return result;
  }

  // I watched this video to learn how to do this: https://www.youtube.com/watch?v=sw3b8bVY2UQ
  public async fetchGameSession(gameSessionID: string): Promise<GameSession> {
    const docRef = doc(this.firestore, 'game-sessions', gameSessionID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as GameSession;
    } else {
      return {} as GameSession;
    }
  }
}
