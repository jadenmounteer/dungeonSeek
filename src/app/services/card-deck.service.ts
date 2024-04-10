import { Injectable } from '@angular/core';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root',
})
export abstract class CardDeckService {
  constructor(protected cardService: CardService) {}

  abstract setCardDeckSubscriptions(gameSessionID: string): void;

  abstract drawCard(gameSessionID: string): Promise<string>;
}
