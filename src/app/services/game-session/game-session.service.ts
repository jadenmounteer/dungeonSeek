import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { GameSession } from '../../types/game-session';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Character } from '../../types/character';

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

  public async updateGameSession(gameSession: GameSession): Promise<any> {
    const docRef = doc(this.firestore, 'game-sessions', gameSession.id);
    await updateDoc(docRef, { ...gameSession } as { [x: string]: any });
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

  public addCharacterToGameSession(
    gameSessionId: string,
    newCharacter: Character
  ): Promise<any> {
    const collectionRef = collection(
      this.firestore,
      'game-sessions',
      gameSessionId,
      'characters'
    );

    return addDoc(collectionRef, newCharacter);
  }

  public generateEntranceCode(): string {
    let code = '';

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      code += alphabet[randomIndex];
    }

    // Add a random 3 digit number to the code
    code += Math.floor(Math.random() * 1000);

    return code;
  }
}
