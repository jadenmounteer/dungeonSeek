import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardDeck, DeckName } from '../types/card-deck';
import { ItemCardInfo, ItemCardNames } from '../types/item-card-info';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root',
})
export class ItemCardService implements OnDestroy {
  private itemDeckSub: Subscription | undefined;
  private itemDeck: CardDeck[] = [];

  // Map to hold the json data for the cards
  private itemCardsInfo: Map<string, ItemCardInfo> = new Map();

  constructor(private cardService: CardService) {}

  ngOnDestroy(): void {
    if (this.itemDeckSub) {
      this.itemDeckSub.unsubscribe();
    }
  }

  public setCardDeckSubscriptions(gameSessionID: string) {
    if (!this.itemDeckSub) {
      this.itemDeckSub = this.cardService
        .getCardDeckForGameSession(gameSessionID, DeckName.ITEMS)
        .subscribe((itemCards: CardDeck[]) => {
          this.itemDeck = itemCards;
        });
    }
  }

  public async drawItemCard(gameSessionID: string): Promise<string> {
    const deck = this.itemDeck[0];

    let nextCard = deck.cardNames.pop() as string; // We draw it and it is removed from the deck

    // Get the card's info from the JSON
    const cardInfo = this.getItemCardInfo(nextCard);

    // If the card is not a one-time use, put it at the bottom of the deck to be drawn again
    if (cardInfo?.discardAfterUse === false) {
      this.cardService.placeCardBackInDeck(deck, nextCard);
    }

    await this.cardService.updateCardDeck(deck, gameSessionID);

    return nextCard;
  }

  /**
   * Gets a specific card's information when you draw one off the top of the deck
   * @param cardName
   * @param deckName
   * @returns
   */
  public getItemCardInfo(cardName: string): ItemCardInfo | undefined {
    return this.itemCardsInfo.get(cardName);
  }

  // This is necessary so I can keep all the card data in JSON and not overload the db
  public async fetchItemCardInfoFromJSON(): Promise<void> {
    const cards = (await this.cardService.fetchCardsInfoByDeck(
      DeckName.ITEMS
    )) as ItemCardInfo[];
    const mapOfCardNames = new Map<string, ItemCardInfo>();
    cards.forEach((card) => {
      mapOfCardNames.set(card.name, card);
    });
    this.itemCardsInfo = mapOfCardNames;
  }

  public async createItemCardDeck(gameSessionID: string): Promise<void> {
    let cardNames: string[] = [];
    cardNames = Object.values(ItemCardNames);

    // Get the card info map
    await this.fetchItemCardInfoFromJSON();

    // Create a map of the card's name and the quantity of the card
    const mapOfCardNamesAndQty = new Map<string, number>();

    this.itemCardsInfo.forEach((value, key) => {
      mapOfCardNamesAndQty.set(key, value.quantity);
    });

    cardNames =
      this.cardService.addCardsToDeckAccordingToQuantity(mapOfCardNamesAndQty);

    await this.cardService.createCardDeck(
      gameSessionID,
      DeckName.ITEMS,
      cardNames
    );
  }
}
