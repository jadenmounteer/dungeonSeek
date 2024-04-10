import { Injectable, OnDestroy } from '@angular/core';
import { CardService } from './card.service';
import { Subscription } from 'rxjs';
import { CardDeck, DeckName } from '../types/card-deck';
import { WeaponCardInfo, WeaponCardNames } from '../types/weapon-card-info';

@Injectable({
  providedIn: 'root',
})
export class WeaponCardService implements OnDestroy {
  private weaponDeckSub: Subscription | undefined;
  private weaponDeck: CardDeck[] = [];

  // Map to hold the json data for the cards
  private weaponCardsInfo: Map<string, WeaponCardInfo> = new Map();

  constructor(private cardService: CardService) {}

  ngOnDestroy(): void {
    if (this.weaponDeckSub) {
      this.weaponDeckSub.unsubscribe();
    }
  }

  public setCardDeckSubscriptions(gameSessionID: string) {
    if (!this.weaponDeckSub) {
      this.weaponDeckSub = this.cardService
        .getCardDeckForGameSession(gameSessionID, DeckName.WEAPONS)
        .subscribe((weaponCards: CardDeck[]) => {
          this.weaponDeck = weaponCards;
        });
    }
  }

  public async drawWeaponCard(gameSessionID: string): Promise<string> {
    const deck = this.weaponDeck[0];

    let nextCard = deck.cardNames.pop() as string; // We draw it and it is removed from the deck

    // Get the card's info from the JSON
    const cardInfo = this.getWeaponCardInfo(nextCard);

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
  public getWeaponCardInfo(cardName: string): WeaponCardInfo | undefined {
    return this.weaponCardsInfo.get(cardName);
  }

  // This is necessary so I can keep all the card data in JSON and not overload the db
  public async fetchWeaponCardInfoFromJSON(): Promise<void> {
    const cards = (await this.cardService.fetchCardsInfoByDeck(
      DeckName.WEAPONS
    )) as WeaponCardInfo[];
    const mapOfCardNames = new Map<string, WeaponCardInfo>();
    cards.forEach((card) => {
      mapOfCardNames.set(card.name, card);
    });
    this.weaponCardsInfo = mapOfCardNames;
  }

  public async createWeaponCardDeck(gameSessionID: string): Promise<void> {
    let cardNames: string[] = [];
    cardNames = Object.values(WeaponCardNames);

    // Get the card info map
    await this.fetchWeaponCardInfoFromJSON();

    // Create a map of the card's name and the quantity of the card
    const mapOfCardNamesAndQty = new Map<string, number>();

    this.weaponCardsInfo.forEach((value, key) => {
      mapOfCardNamesAndQty.set(key, value.quantity);
    });

    cardNames =
      this.cardService.addCardsToDeckAccordingToQuantity(mapOfCardNamesAndQty);

    await this.cardService.createCardDeck(
      gameSessionID,
      DeckName.WEAPONS,
      cardNames
    );
  }
}
