import { Injectable, OnDestroy } from '@angular/core';
import { CardService } from './card.service';
import { CardDeck, DeckName } from '../types/card-deck';
import { LocationType } from './location-service';
import { Subscription } from 'rxjs';
import { EventCardInfo } from '../types/event-card';
import { CardDeckService } from './card-deck.service';

@Injectable({
  providedIn: 'root',
})
export class EventCardService extends CardDeckService implements OnDestroy {
  private roadEventDeckSub: Subscription | undefined;
  private cityEventDeckSub: Subscription | undefined;
  private ForestEventDeckSub: Subscription | undefined;
  private roadEventDeck: CardDeck[] = [];
  private cityEventDeck: CardDeck[] = [];
  private forestEventDeck: CardDeck[] = [];

  // These maps hold all the JSON data for the event cards.
  // They are used to get a specific event card when you don't want to get one off the top of the deck
  // They are also used to display the card data in the UI
  private roadEventCardsInfo: Map<string, EventCardInfo> = new Map();
  private cityEventCardsInfo: Map<string, EventCardInfo> = new Map();
  private forestEventCardsInfo: Map<string, EventCardInfo> = new Map();

  ngOnDestroy(): void {
    if (this.roadEventDeckSub) {
      this.roadEventDeckSub.unsubscribe();
    }
    if (this.cityEventDeckSub) {
      this.cityEventDeckSub.unsubscribe();
    }
    if (this.ForestEventDeckSub) {
      this.ForestEventDeckSub.unsubscribe();
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

    if (!this.ForestEventDeckSub) {
      this.ForestEventDeckSub = this.cardService
        .getCardDeckForGameSession(gameSessionID, DeckName.FOREST_EVENTS)
        .subscribe((forestEventCards: CardDeck[]) => {
          this.forestEventDeck = forestEventCards;
        });
    }
  }

  public async drawCard(
    gameSessionID: string,
    locationType: LocationType
  ): Promise<string> {
    const deck = this.getEventCardDeckAccordingToLocationType(locationType);

    let nextCard = deck.cardNames.pop() as string; // We draw it and it is removed from the deck

    // Get the card's info from the JSON
    const cardInfo = this.getCardInfo(nextCard, deck.deckName as DeckName);

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
    } else if (locationType === 'Forest') {
      return this.forestEventDeck[0];
    } else if (locationType === 'Dungeon') {
      return this.roadEventDeck[0];
    } else {
      throw new Error('No card deck corresponding to location type.');
    }
  }

  /**
   * Gets a specific event card's information when you draw one off the top of the deck
   * @param cardName
   * @param deckName
   * @returns
   */
  public getCardInfo(
    cardName: string,
    deckName: DeckName
  ): EventCardInfo | undefined {
    if (deckName === DeckName.ROAD_EVENTS) {
      return this.roadEventCardsInfo.get(cardName);
    }
    if (deckName === DeckName.CITY_EVENTS) {
      return this.cityEventCardsInfo.get(cardName);
    }
    if (deckName === DeckName.FOREST_EVENTS) {
      return this.forestEventCardsInfo.get(cardName);
    }
    return;
  }

  // This is necessary so I can keep all the card data in JSON and not overload the db
  public async fetchCardInfoFromJSON(): Promise<void> {
    await this.setEventCardInfoMaps();
  }

  private async setRoadEventInfoMap() {
    const cards = (await this.cardService.fetchCardsInfoByDeck(
      DeckName.ROAD_EVENTS
    )) as EventCardInfo[];
    const mapOfCardNames = new Map<string, EventCardInfo>();
    cards.forEach((card) => {
      mapOfCardNames.set(card.name, card);
    });
    this.roadEventCardsInfo = mapOfCardNames;
  }

  private async setCityEventInfoMap() {
    const cards = (await this.cardService.fetchCardsInfoByDeck(
      DeckName.CITY_EVENTS
    )) as EventCardInfo[];
    const mapOfCardNames = new Map<string, EventCardInfo>();
    cards.forEach((card) => {
      mapOfCardNames.set(card.name, card);
    });
    this.cityEventCardsInfo = mapOfCardNames;
  }

  private async setForestEventInfoMap() {
    const cards = (await this.cardService.fetchCardsInfoByDeck(
      DeckName.FOREST_EVENTS
    )) as EventCardInfo[];
    const mapOfCardNames = new Map<string, EventCardInfo>();
    cards.forEach((card) => {
      mapOfCardNames.set(card.name, card);
    });
    this.forestEventCardsInfo = mapOfCardNames;
  }

  private async setEventCardInfoMaps() {
    await this.setRoadEventInfoMap();
    await this.setCityEventInfoMap();
    await this.setForestEventInfoMap();
  }

  private getEventCardDeckNames(): DeckName[] {
    return [DeckName.ROAD_EVENTS, DeckName.CITY_EVENTS, DeckName.FOREST_EVENTS];
  }

  public async createDeck(gameSessionID: string, deckName: DeckName) {
    let mapOfCardNamesAndQty = new Map<string, number>();

    if (deckName === DeckName.ROAD_EVENTS) {
      this.roadEventCardsInfo.forEach((value, key) => {
        mapOfCardNamesAndQty.set(key, value.quantity);
      });
    }
    if (deckName === DeckName.CITY_EVENTS) {
      this.cityEventCardsInfo.forEach((value, key) => {
        mapOfCardNamesAndQty.set(key, value.quantity);
      });
    }

    if (deckName === DeckName.FOREST_EVENTS) {
      this.forestEventCardsInfo.forEach((value, key) => {
        mapOfCardNamesAndQty.set(key, value.quantity);
      });
    }

    let cardNames =
      this.cardService.addCardsToDeckAccordingToQuantity(mapOfCardNamesAndQty);

    await this.cardService.createCardDeck(gameSessionID, deckName, cardNames);
  }

  public async createEventCardDecks(gameSessionID: string): Promise<void> {
    // Create a new card deck for each option in the DeckName type that are event types.
    // Get the card info map
    await this.fetchCardInfoFromJSON();

    for (const deckType of this.getEventCardDeckNames()) {
      this.createDeck(gameSessionID, deckType);
    }
  }
}
