import { Injectable, OnDestroy } from '@angular/core';
import { CardService } from './card.service';
import { CardDeck, DeckName } from '../types/card-deck';
import { LocationType } from './location-service';
import { Subscription } from 'rxjs';
import {
  CityEventCardNames,
  EventCardInfo,
  RoadEventCardNames,
} from '../types/event-card';

@Injectable({
  providedIn: 'root',
})
export class EventCardService implements OnDestroy {
  private roadEventDeckSub: Subscription | undefined;
  private cityEventDeckSub: Subscription | undefined;
  private roadEventDeck: CardDeck[] = [];
  private cityEventDeck: CardDeck[] = [];

  // These maps hold all the JSON data for the event cards.
  // They are used to get a specific event card when you don't want to get one off the top of the deck
  // They are also used to display the card data in the UI
  private roadEventCardsInfo: Map<string, EventCardInfo> = new Map();
  private cityEventCardsInfo: Map<string, EventCardInfo> = new Map();

  constructor(private cardService: CardService) {}

  ngOnDestroy(): void {
    if (this.roadEventDeckSub) {
      this.roadEventDeckSub.unsubscribe();
    }
    if (this.cityEventDeckSub) {
      this.cityEventDeckSub.unsubscribe();
    }
  }

  public setCardDeckSubscriptions(gameSessionID: string) {
    if (!this.roadEventDeckSub) {
      this.roadEventDeckSub = this.cardService
        .getCardDeckForGameSession(gameSessionID, DeckName.ROAD_EVENTS)
        .subscribe((roadEventCards: CardDeck[]) => {
          this.roadEventDeck = roadEventCards;
        });
    }

    if (!this.cityEventDeckSub) {
      this.cityEventDeckSub = this.cardService
        .getCardDeckForGameSession(gameSessionID, DeckName.CITY_EVENTS)
        .subscribe((cityEventCards: CardDeck[]) => {
          this.cityEventDeck = cityEventCards;
        });
    }
  }

  public async drawEventCard(
    locationType: LocationType,
    gameSessionID: string
  ): Promise<string> {
    const deck = this.getEventCardDeckAccordingToLocationType(locationType);

    let nextCard = deck.cardNames.pop() as string; // We draw it and it is removed from the deck

    // Get the card's info from the JSON
    const cardInfo = this.getEventCardInfo(nextCard, deck.deckName as DeckName);

    // If the card is not a one-time use, put it at the bottom of the deck to be drawn again
    if (cardInfo?.discardAfterUse === false) {
      this.cardService.placeCardBackInDeck(deck, nextCard);
    }

    await this.cardService.updateCardDeck(deck, gameSessionID);

    return nextCard;
  }

  private getEventCardDeckAccordingToLocationType(
    locationType: LocationType
  ): CardDeck {
    // We use [0] because I'm lazy and that's how the observable works.
    // I know it's messy but that's the price I need to pay if I want to use JSON for the card info.
    if (locationType === 'Road') {
      return this.roadEventDeck[0];
    } else if (locationType === 'City') {
      return this.cityEventDeck[0];
    } else if (locationType === 'Dungeon') {
      return this.roadEventDeck[0];
    } else {
      throw new Error('No card deck corresponding to location type.');
    }
  }

  // Called when a user jumps into the game.
  // This allows them to have access to the event cards.
  // Using JSON for the card info so I don't have to overload the db
  private async fetchEventCardsInfo(
    deckName: DeckName
  ): Promise<EventCardInfo[]> {
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
   * @param deckName
   * @returns
   */
  public getEventCardInfo(
    cardName: string,
    deckName: DeckName
  ): EventCardInfo | undefined {
    if (deckName === DeckName.ROAD_EVENTS) {
      return this.roadEventCardsInfo.get(cardName);
    }
    if (deckName === DeckName.CITY_EVENTS) {
      return this.cityEventCardsInfo.get(cardName);
    }
    return;
  }

  // This is necessary so I can keep all the card data in JSON and not overload the db
  public async fetchEventCardInfoFromJSON(): Promise<void> {
    await Promise.all(
      Object.values(DeckName).map(async (deckName) => {
        const cards = await this.fetchEventCardsInfo(deckName as DeckName);
        const mapOfCardNames = new Map<string, EventCardInfo>();
        cards.forEach((card) => {
          mapOfCardNames.set(card.name, card);
        });

        this.setEventCardInfoMaps(deckName as DeckName, mapOfCardNames);
      })
    );
  }

  private setEventCardInfoMaps(
    deckName: DeckName,
    mapOfCardNames: Map<string, EventCardInfo>
  ) {
    if (deckName === DeckName.ROAD_EVENTS) {
      this.roadEventCardsInfo = mapOfCardNames;
    }
    if (deckName === DeckName.CITY_EVENTS) {
      this.cityEventCardsInfo = mapOfCardNames;
    }
  }

  public async createEventCardDecks(gameSessionID: string): Promise<void> {
    // Create a new card deck for each option in the DeckName type that are event types.
    // Get the card info map
    await this.fetchEventCardInfoFromJSON();

    for (const deckName of Object.values(DeckName)) {
      const deckType = deckName as DeckName;

      // I'm going to regret this...
      // This is so we don't add other deck types here.
      if (!this.deckNameIsEventDeck(deckType)) {
        return;
      }

      // get the card names from the CardName enum
      let mapOfCardNamesAndQty = new Map<string, number>();

      if (deckType === DeckName.ROAD_EVENTS) {
        this.roadEventCardsInfo.forEach((value, key) => {
          mapOfCardNamesAndQty.set(key, value.quantity);
        });
      }
      if (deckType === DeckName.CITY_EVENTS) {
        this.cityEventCardsInfo.forEach((value, key) => {
          mapOfCardNamesAndQty.set(key, value.quantity);
        });
      }

      let cardNames =
        this.cardService.addCardsToDeckAccordingToQuantity(
          mapOfCardNamesAndQty
        );

      this.cardService.createCardDeck(gameSessionID, deckType, cardNames);
    }
  }

  private deckNameIsEventDeck(deckName: DeckName): boolean {
    return (
      deckName === DeckName.ROAD_EVENTS || deckName === DeckName.CITY_EVENTS
    );
  }
}
