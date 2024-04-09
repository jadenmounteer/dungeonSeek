import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardDeck, DeckName } from '../types/card-deck';
import { ItemCardInfo } from '../types/item-card-info';
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
}
