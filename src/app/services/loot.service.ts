import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LootService {
  // Subjects are used as event emitters to tell the game component to draw a card.
  public drawEasyWeaponSubject = new Subject<void>();
  public drawEasyItemSubject = new Subject<void>();

  constructor() {}

  private shouldDrawWeaponCard(): boolean {
    // Randomly determine if the player should draw a weapon card
    return Math.random() > 0.5;
  }
  public drawEasyLootCard(): void {
    if (this.shouldDrawWeaponCard()) {
      this.drawEasyWeaponSubject.next();
    } else {
      this.drawEasyItemSubject.next();
    }
  }
}
