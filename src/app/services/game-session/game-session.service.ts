import { Injectable } from '@angular/core';
import {
  addDoc,
  arrayUnion,
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
import { CharacterService } from '../character/character.service';

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

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private characterService: CharacterService
  ) {}

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
    code += Math.floor(Math.random() * 3000);

    return code;
  }

  public joinGameSession(gameSessionId: string): Promise<any> {
    const docRef = doc(this.firestore, 'game-sessions', gameSessionId);
    return updateDoc(docRef, {
      playerIDs: arrayUnion(this.authService.activeUser!.uid),
    });
  }

  public findGameSessionIDByEntranceCode(entranceCode: string): Promise<any> {
    const gameSessionsRef = collection(this.firestore, 'game-sessions');
    const queryRef = query(
      gameSessionsRef,
      where('entranceCode', '==', entranceCode)
    );
    return new Promise((resolve, reject) => {
      onSnapshot(queryRef, (querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          reject('No game xwsession found with that entrance code');
        } else {
          resolve(querySnapshot.docs[0].id);
        }
      });
    });
  }

  public getCharactersInCurrentGameSession(
    allCharactersInGameLobby: Character[],
    gameSession: GameSession
  ): Character[] {
    let clientsCharacters = this.characterService.getClientCharacters(
      allCharactersInGameLobby,
      this.authService.activeUser?.uid
    );

    let onlineCharactersInCurrentGameSession = allCharactersInGameLobby.filter(
      (character) => {
        return (
          character.userId !== this.authService.activeUser?.uid &&
          gameSession.characterIDsCurrentlyInGame.includes(character.id)
        );
      }
    );

    return [...clientsCharacters, ...onlineCharactersInCurrentGameSession];
  }

  public addPlayersAndCharactersToGameSession(
    playersCharacters: Character[],
    gameSession: GameSession
  ): Promise<any> {
    let charactersWhoJustJoined = playersCharacters.filter((character) => {
      return !gameSession.characterIDsCurrentlyInGame.includes(character.id);
    });

    // Add the characters to the existing characterIDsCurrentlyInGame array
    gameSession.characterIDsCurrentlyInGame = [
      ...gameSession.characterIDsCurrentlyInGame,
      ...charactersWhoJustJoined.map((c) => c.id),
    ];

    let playersWhoJustJoined = playersCharacters.filter((character) => {
      return !gameSession.playerIDsCurrentlyInGame.includes(character.userId);
    });

    // Add players to the game session
    gameSession.playerIDsCurrentlyInGame = [
      ...gameSession.playerIDsCurrentlyInGame,
      ...playersWhoJustJoined.map((c) => c.userId),
    ];

    return this.updateGameSession(gameSession);
  }

  // This means the player is leaving the game session.
  // They may come back later.
  public async temporarilyRemovePlayersAndCharactersFromGameSession(
    gameSession: GameSession,
    playersCharacters: Character[]
  ) {
    // Remove the characters from the characterIDsCurrentlyInGame array
    gameSession.characterIDsCurrentlyInGame =
      gameSession.characterIDsCurrentlyInGame.filter(
        (id) => !playersCharacters.map((c) => c.id).includes(id)
      );

    gameSession.playerIDsCurrentlyInGame =
      gameSession.playerIDsCurrentlyInGame.filter((id) => {
        return !playersCharacters.map((c) => c.userId).includes(id);
      });

    await this.updateGameSession(gameSession);
  }

  public getXOffset(): number {
    // To center the player on the screen, we need to know the width of the screen
    return (window.innerWidth / 2) * -1;
  }

  public getYOffset(): number {
    // To center the player on the screen, we need to know the width of the screen
    return (window.innerHeight / 2) * -1;
  }

  public scrollToCharacterBeingControlledByClient(
    characterBeingControlledByClient: Character | undefined
  ) {
    if (!characterBeingControlledByClient) {
      return;
    }

    const xOffset = this.getXOffset();
    const yOffset = this.getYOffset();
    const characterXPosition =
      characterBeingControlledByClient.currentLocation.position.xPosition +
      xOffset;
    const characterYPosition =
      characterBeingControlledByClient.currentLocation.position.yPosition +
      yOffset;
    const duration = 600;

    let startingY = window.scrollY;
    let startingX = window.scrollX;
    let xDif = characterXPosition - startingX;
    let yDiff = characterYPosition - startingY;
    let start: number | null = null;

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    // This method was inspired by this stack overflow post: https://stackoverflow.com/questions/17722497/scroll-smoothly-to-specific-element-on-page
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      // Elapsed milliseconds since start of scrolling.
      let time = timestamp - start;
      // Get percent of completion in range [0, 1].
      let percent = Math.min(time / duration, 1);

      window.scrollTo(startingX + xDif * percent, startingY + yDiff * percent);

      // Proceed with animation as long as we wanted it to.
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    });
  }
}
