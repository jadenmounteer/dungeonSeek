import { Injectable } from '@angular/core';
import { CardService } from './card.service';
import { LocationType } from './location-service';
import { CardCriteria, DeckName } from '../types/card-deck';

@Injectable({
  providedIn: 'root',
})
export abstract class CardDeckService {
  constructor(protected cardService: CardService) {}

  abstract setCardDeckSubscriptions(gameSessionID: string): void;

  abstract drawCard(
    gameSessionID: string,
    cardCriteria?: CardCriteria
  ): Promise<string>;

  protected abstract cardMeetsCriteria(
    cardCriteria: CardCriteria,
    cardInfo: any
  ): boolean;

  /**
   * Gets a specific card's information when you draw one off the top of the deck
   * @param cardName
   * @param deckName
   * @returns the info type of that card
   */
  abstract getCardInfo(cardName: string, deckName?: DeckName): any;

  // This is necessary so I can keep all the card data in JSON and not overload the db
  abstract fetchCardInfoFromJSON(): Promise<void>;

  abstract createDeck(
    gameSessionID: string,
    deckName?: DeckName
  ): Promise<void>;
}
