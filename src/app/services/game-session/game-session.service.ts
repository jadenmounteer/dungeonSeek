import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { GameSession } from '../../types/game-session';
import { Observable } from 'rxjs';
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

  public getGameSession(gameSessionID: string): Observable<GameSession> {
    const docRef = doc(this.firestore, 'game-sessions', gameSessionID);
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(docRef, (doc) => {
        const gameSession = doc.data() as GameSession;
        gameSession.id = doc.id;
        observer.next(gameSession);
      });
      return () => unsubscribe();
    });
  }
}
