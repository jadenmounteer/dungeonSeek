import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  getDocs,
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

  private gameSessionID: string = '';

  private gameSessionQuery = query(
    collection(this.firestore, 'game-sessions'),
    where('id', '==', this.gameSessionID)
  );

  public usersGameSessions$: Observable<GameSession[]> = collectionData(
    this.activeUsersSessionsQuery,
    {
      // This sets the id to the id of the document
      idField: 'id',
    }
  ) as Observable<GameSession[]>;

  public gameSessionById$: Observable<GameSession[]> = collectionData(
    this.gameSessionQuery,
    {
      // This sets the id to the id of the document
      idField: 'id',
    }
  ) as Observable<GameSession[]>;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  public setGameSessionID(gameSessionID: string): void {
    this.gameSessionID = gameSessionID;
    console.log(this.gameSessionID);
  }

  public async createNewGameSession(gameSession: GameSession): Promise<any> {
    // create a new game session
    const collectionRef = collection(this.firestore, 'game-sessions');

    const result = await addDoc(collectionRef, gameSession);

    return result;
  }
}
