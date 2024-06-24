import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Npc, NpcInfo } from '../types/npc';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { CardService } from './card.service';
import { DeckName } from '../types/card-deck';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  #firestore: Firestore = inject(Firestore);
  private cardService: CardService = inject(CardService);

  // Map to hold the json data for the cards
  private npcInfo: Map<string, NpcInfo> = new Map();

  constructor() {
    // We don't handle NPC cards like other card decks because specific npcs come from event cards.
    // So, we fetch the data from JSON when the user enters the game session.
    // They are then stored in a map for easy access.
    this.fetchCardInfoFromJSON();
  }

  public async fetchCardInfoFromJSON(): Promise<void> {
    const cards = (await this.cardService.fetchCardsInfoByDeck(
      DeckName.BASE_GAME_NPCS
    )) as NpcInfo[];
    const mapOfCardNames = new Map<string, NpcInfo>();
    cards.forEach((card) => {
      mapOfCardNames.set(card.npcType, card);
    });
    this.npcInfo = mapOfCardNames;
  }

  public getCardInfo(cardName: string): NpcInfo | undefined {
    return this.npcInfo.get(cardName);
  }

  public getNPCsInGameSession(gameSessionID: string): Observable<Npc[]> {
    const collectionRef = collection(
      this.#firestore,
      'game-sessions',
      gameSessionID,
      'npcs'
    );

    return collectionData(collectionRef, {
      // This sets the id to the id of the document
      idField: 'id',
    }) as Observable<Npc[]>;
  }

  public addNewNpcToGameSession(npc: Npc, gameSessionID: string): Promise<any> {
    const collectionRef = collection(
      this.#firestore,
      'game-sessions',
      gameSessionID,
      'npcs'
    );

    return addDoc(collectionRef, npc).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }
}
