import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CardRewardType } from '../types/card-reward-type';

@Injectable({
  providedIn: 'root',
})
export class LootService {
  // Subjects are used as event emitters to tell the game component to draw a card.
  public drawWeaponSubject = new Subject<CardRewardType>();
  public drawItemSubject = new Subject<CardRewardType>();

  constructor() {}

  private shouldDrawWeaponCard(): boolean {
    // Randomly determine if the player should draw a weapon card
    return Math.random() > 0.5;
  }
  public drawLootCard(lootType: CardRewardType): void {
    if (this.shouldDrawWeaponCard()) {
      this.drawWeaponSubject.next(lootType);
    } else {
      this.drawItemSubject.next(lootType);
    }
  }
}
