import { Injectable, OnDestroy } from '@angular/core';
import { CardDeckService } from './card-deck.service';
import { NPCCardInfo } from '../types/npc';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NpcCardService extends CardDeckService implements OnDestroy {
  #npcCardsInfo: Map<string, NPCCardInfo> = new Map();
  #npcDeckSub: Subscription | undefined;

  public ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public setCardDeckSubscriptions(gameSessionID: string): void {
    if (!this.#npcDeckSub) {
      this.#npcDeckSub = this.cardService
        .getCardDeckForGameSession(gameSessionID, 'npcs')
        .subscribe((npcCards: any) => {
          this.#npcCardsInfo = npcCards;
        });
    }
  }
}
