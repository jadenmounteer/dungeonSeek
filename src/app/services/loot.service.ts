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
  public drawGoldSubject = new Subject<number>();

  constructor() {}

  private pickANumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getAmountOfGold(lootType: CardRewardType): number {
    let minGold = 0;
    let maxGold = 0;

    // Set the min and max according to the lootType
    if (lootType === 'Easy') {
      minGold = 1;
      maxGold = 10;
    } else if (lootType === 'Moderate') {
      minGold = 11;
      maxGold = 49;
    } else if (lootType === 'Hard') {
      minGold = 50;
      maxGold = 100;
    } else if (lootType === 'Insane') {
      minGold = 100;
      maxGold = 200;
    }

    return this.pickANumberBetween(minGold, maxGold);
  }

  public drawLootCard(lootType: CardRewardType): void {
    // const randomNumber = this.pickANumberBetween(1, 3);
    const randomNumber = 1;

    if (randomNumber === 1) {
      this.drawWeaponSubject.next(lootType);
    } else if (randomNumber === 2) {
      this.drawItemSubject.next(lootType);
    } else {
      // Give the player gold
      const goldAmount = this.getAmountOfGold(lootType);
      this.drawGoldSubject.next(goldAmount);
    }
  }
}
