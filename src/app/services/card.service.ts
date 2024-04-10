import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { CardDeck, DeckName } from '../types/card-deck';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private firestore: Firestore) {}

  // Observables to get the card decks from the db
  // The card decks just hold the name of the deck and the card names and the order which they are drawn.
  public getCardDeckForGameSession(
    gameSessionId: string,
    deckName: DeckName
  ): Observable<CardDeck[]> {
    // Get the road event card deck from this specific game session
    const collectionRef = collection(
      this.firestore,
      'game-sessions',
      gameSessionId,
      'card-decks'
    );
    const queryRef = query(collectionRef, where('deckName', '==', deckName));

    return collectionData(queryRef, {
      // This sets the id to the id of the document
      idField: 'id',
    }) as Observable<CardDeck[]>;
  }

  public addCardsToDeckAccordingToQuantity(
    mapOfCardNamesAndQty: Map<string, number>
  ) {
    let cardNames: string[] = [];

    // loop through the key and value of the map
    for (const [key, value] of mapOfCardNamesAndQty) {
      // Add the card to the deck according to the quantity
      for (let i = 0; i < value; i++) {
        cardNames.push(key);
      }
    }

    return cardNames;
  }

  public createCardDeck(
    gameSessionID: string,
    deckType: DeckName,
    cardNames: string[]
  ) {
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

  public shuffle(array: Array<any>): string[] {
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

  public placeCardBackInDeck(cardDeck: CardDeck, nextCard: string): void {
    // If the card is not a one-time use, put it at the bottom of the deck to be drawn again
    cardDeck.cardNames.unshift(nextCard);
    // Since we inserted the card again, shuffle the deck so the order isn't predictable
    cardDeck.cardNames = this.shuffle(cardDeck.cardNames);
  }

  public updateCardDeck(cardDeck: CardDeck, gameSessionID: string) {
    // Update the db
    const docRef = doc(
      collection(this.firestore, 'game-sessions', gameSessionID, 'card-decks'),
      cardDeck.id
    );
    // Update the card deck in the db
    updateDoc(docRef, { ...cardDeck });
  }

  // Called when a user jumps into the game.
  // This allows them to have access to the event cards.
  // Using JSON for the card info so I don't have to overload the db
  public async fetchCardsInfoByDeck(deckName: DeckName): Promise<any[]> {
    // Get the deck key from the deck name
    const deckKey = Object.keys(DeckName).find((key) => {
      return DeckName[key as keyof typeof DeckName] === deckName;
    });
    // fetch the JSON data using http
    const response = await fetch(`assets/json/cards/${deckKey}.json`);
    const jsonResponse = await response.json();

    return jsonResponse;
  }
}
