import { Injectable } from '@angular/core';
import { LocationType } from './location-service';

export type CardName = 'Crazy Traveler';
export type EventCard = {
  name: CardName;
  description: string;
};

@Injectable({
  providedIn: 'root',
})
export class CardService {
  // This map holds a all the road events.
  // It is used to get a specific event card when you don't want to get one off the top of the deck
  private roadEvents: Map<CardName, EventCard> = new Map();
  constructor() {}

  // Called when a user jumps into the game.
  // This allows them to have access to the event cards.
  public async fetchEventCards() {
    // fetch the JSON data using http
    const response = await fetch('assets/json/event-cards/road-events.json');
    const jsonResponse = await response.json();

    // Create the road events map
    jsonResponse.forEach((eventCard: EventCard) => {
      this.roadEvents.set(eventCard.name, eventCard);
    });
  }

  /**
   * Gets a specific event card when you don't want to get one off the top of the deck
   * @param cardName
   * @param locationType
   * @returns
   */
  public getEventCard(
    cardName: CardName,
    locationType: LocationType
  ): EventCard | undefined {
    if (locationType === 'Road') {
      return this.roadEvents.get(cardName);
    }
    return;
  }
}
