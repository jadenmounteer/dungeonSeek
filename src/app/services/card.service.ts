import { Injectable } from '@angular/core';
import { LocationType } from './location-service';

export type CardName = 'Crazy Traveler';
export type Card = {
  name: CardName;
  description: string;
};

@Injectable({
  providedIn: 'root',
})
export class CardService {
  // This map holds a all the road events.
  // It is used to get a specific event card when you don't want to get one off the top of the deck
  private roadEvents: Map<CardName, Card> = new Map();
  constructor() {}

  // Called when a user jumps into the game.
  // This allows them to have access to the event cards.
  public async fetchEventCards() {
    // fetch the JSON data using http
    const response = await fetch('assets/json/event-cards/road-events.json');
    const jsonResponse = await response.json();

    // Create the road events map
    jsonResponse.forEach((eventCard: Card) => {
      this.roadEvents.set(eventCard.name, eventCard);
    });
  }

  /**
   * Gets a specific event card when you don't want to get one off the top of the deck
   * @param cardName
   * @param locationType
   * @returns
   */
  public getCard(
    cardName: CardName,
    locationType: LocationType
  ): Card | undefined {
    if (locationType === 'Road') {
      return this.roadEvents.get(cardName);
    }
    return;
  }

  public createCardDeck(): CardName[] {
    // Shuffle all of the CardNames into an array
    const cardNames = Array.from(this.roadEvents.keys());
    return this.shuffle(cardNames);
  }

  private shuffle(array: Array<CardName>): Array<CardName> {
    // shuffle the array
    return array.sort(() => Math.random() - 0.5);
  }
}
