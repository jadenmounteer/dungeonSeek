import { Injectable } from '@angular/core';
import { LocationType } from './location-service';
import { addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import {
  CardInfo,
  CardDeck,
  RoadEventCardNames,
  CityEventCardNames,
  DeckName,
} from '../types/card-deck';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  // This map holds a all the road events.
  // It is used to get a specific event card when you don't want to get one off the top of the deck
  private roadEventCardsInfo: Map<string, CardInfo> = new Map();
  private cityEventCardsInfo: Map<string, CardInfo> = new Map();

  // includes the names of the cards in the deck.
  public cardDecks: CardDeck[] = [];

  constructor(private firestore: Firestore) {}

  public fetchCardDecks(gameSessionId: string): Observable<CardDeck[]> {
    const collectionRef = collection(
      this.firestore,
      'game-sessions',
      gameSessionId,
      'card-decks'
    );

    return collectionData(collectionRef, {
      // This sets the id to the id of the document
      idField: 'id',
    }) as Observable<CardDeck[]>;
  }

  // Called when a user jumps into the game.
  // This allows them to have access to the event cards.
  // Using JSON for the card info so I don't have to overload the db
  private async fetchEventCardsInfo(deckName: DeckName): Promise<CardInfo[]> {
    // Get the deck key from the deck name
    const deckKey = Object.keys(DeckName).find((key) => {
      return DeckName[key as keyof typeof DeckName] === deckName;
    });
    // fetch the JSON data using http
    const response = await fetch(`assets/json/cards/${deckKey}.json`);
    const jsonResponse = await response.json();

    return jsonResponse;
  }

  /**
   * Gets a specific event card's information when you draw one off the top of the deck
   * @param cardName
   * @param locationType
   * @returns
   */
  public getCardInfo(
    cardName: string,
    deckName: DeckName
  ): CardInfo | undefined {
    if (deckName === DeckName.ROAD_EVENTS) {
      return this.roadEventCardsInfo.get(cardName);
    }
    if (deckName === DeckName.CITY_EVENTS) {
      return this.cityEventCardsInfo.get(cardName);
    }
    return;
  }

  public async createCardDecks(gameSessionID: string) {
    // Create a new card deck for each option in the DeckName type
    Object.values(DeckName).forEach((deckName) => {
      this.createCardDeck(gameSessionID, deckName as DeckName);
    });
  }

  // Creates a card deck in the db
  public async createCardDeck(
    gameSessionID: string,
    deckType: DeckName
  ): Promise<any> {
    // get the card names from the CardName enum
    let cardNames: string[] = [];
    if (deckType === DeckName.ROAD_EVENTS) {
      cardNames = Object.values(RoadEventCardNames);
    }
    if (deckType === DeckName.CITY_EVENTS) {
      cardNames = Object.values(CityEventCardNames);
    }

    // Shuffle all of the CardNames into an array
    const shuffledCardNames = this.shuffle(cardNames);

    const collectionRef = collection(
      this.firestore,
      'game-sessions',
      gameSessionID,
      'card-decks'
    );

    // Note that we only store the card names in the db.
    // The card info is fetched from JSON when needed so we don't overload the db
    const cardDeck: CardDeck = {
      id: '',
      deckName: deckType,
      cardNames: shuffledCardNames,
    };

    return addDoc(collectionRef, { ...cardDeck });
  }

  // This is necessary so I can keep all the card data in JSON and not overload the db
  public async fetchCardInfoFromJSON(): Promise<void> {
    await Promise.all(
      Object.values(DeckName).map(async (deckName) => {
        const cards = await this.fetchEventCardsInfo(deckName as DeckName);
        const mapOfCardNames = new Map<string, CardInfo>();
        cards.forEach((card) => {
          mapOfCardNames.set(card.name, card);
        });

        if (deckName === DeckName.ROAD_EVENTS) {
          this.roadEventCardsInfo = mapOfCardNames;
        }
        if (deckName === DeckName.CITY_EVENTS) {
          this.cityEventCardsInfo = mapOfCardNames;
        }
      })
    );
  }

  private shuffle(array: Array<any>): string[] {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}
