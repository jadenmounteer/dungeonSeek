import { Injectable, OnDestroy } from '@angular/core';
import { CardService } from './card.service';
import { CardDeck, DeckName } from '../types/card-deck';
import { LocationType } from './location-service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventCardService implements OnDestroy {
  private roadEventDeckSub: Subscription | undefined;
  private cityEventDeckSub: Subscription | undefined;
  private roadEventDeck: CardDeck[] = [];
  private cityEventDeck: CardDeck[] = [];

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

    return await this.cardService.getNextCardInDeck(deck, gameSessionID);
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
}
