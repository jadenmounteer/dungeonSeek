import { Injectable } from '@angular/core';
import { LocationType } from './location-service';
import { addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Card, CardDeck, CardName, DeckName } from '../types/card-deck';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  // This map holds a all the road events.
  // It is used to get a specific event card when you don't want to get one off the top of the deck
  private roadEventCards: Map<CardName, Card> = new Map();

  private cardDecks: Map<DeckName, Map<CardName, Card>> = new Map();

  constructor(private firestore: Firestore) {}

  public setCardDecksMap(listOfCardDecks: CardDeck[]) {
    listOfCardDecks.forEach((cardDeck) => {
      const mapOfCardNames = new Map<CardName, Card>();

      cardDeck.cardNames.forEach((cardName) => {
        const card = this.getCard(cardName, cardDeck.deckName);
        console.log(card);
        if (card) {
          mapOfCardNames.set(cardName, card);
        }
      });

      this.cardDecks.set(cardDeck.deckName, mapOfCardNames);
      console.log(this.cardDecks);
    });
  }

  public getCardDecks(gameSessionId: string): Observable<CardDeck[]> {
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
  private async fetchEventCardsForDeck(deckName: DeckName): Promise<Card[]> {
    // fetch the JSON data using http
    const response = await fetch(`assets/json/cards/${deckName}.json`);
    const jsonResponse = await response.json();

    return jsonResponse;
  }

  /**
   * Gets a specific event card when you draw one off the top of the deck
   * @param cardName
   * @param locationType
   * @returns
   */
  public getCard(cardName: CardName, DeckName: DeckName): Card | undefined {
    const cardMap = this.cardDecks.get(DeckName);
    if (!cardMap) {
      throw new Error('No card deck found for ' + DeckName);
    }
    return cardMap.get(cardName);
  }

  public async createCardDecks(gameSessionID: string) {
    // We first initialize the card decks from JSON so we can have the card names
    await this.initializeGameCardsOnFrontend();
    // Create a new card deck for each option in the DeckName type
    Object.keys(DeckName).forEach((deckName) => {
      this.createCardDeck(gameSessionID, deckName as DeckName);
    });
  }

  // Creates a card deck in the db
  public async createCardDeck(
    gameSessionID: string,
    deckType: DeckName
  ): Promise<any> {
    const cardMap = this.cardDecks.get(deckType);

    if (!cardMap) {
      throw new Error('No card deck found for ' + deckType);
    }

    const cardNames = Array.from(cardMap.keys());

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
  public async initializeGameCardsOnFrontend(): Promise<void> {
    await Promise.all(
      Object.keys(DeckName).map(async (deckName) => {
        const cards = await this.fetchEventCardsForDeck(deckName as DeckName);
        const mapOfCardNames = new Map<CardName, Card>();
        cards.forEach((card) => {
          mapOfCardNames.set(card.name, card);
        });

        this.cardDecks.set(deckName as DeckName, mapOfCardNames);
      })
    );
  }

  private shuffle(array: CardName[]): CardName[] {
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
