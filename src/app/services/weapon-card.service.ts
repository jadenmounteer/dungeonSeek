import { Injectable } from '@angular/core';
import { CardService } from './card.service';
import { Subscription } from 'rxjs';
import { CardDeck } from '../types/card-deck';
import { WeaponCardInfo } from '../types/weapon-card-info';

@Injectable({
  providedIn: 'root',
})
export class WeaponCardService {
  private weaponDeckSub: Subscription | undefined;
  private weaponDeck: CardDeck[] = [];

  // Map to hold the json data for the cards
  private weaponCardsInfo: Map<string, WeaponCardInfo> = new Map();

  constructor(private cardService: CardService) {}
}
