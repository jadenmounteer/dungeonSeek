import { Injectable } from '@angular/core';
import { Card } from './card.service';

interface CardStack<Card> {
  push(item: Card): void;
  pop(): Card | undefined;
  peek(): Card | undefined;
  size(): number;
}

@Injectable({
  providedIn: 'root',
})
export class CardDeckService {
  // TODO Replace this with pushing it to the game session and updating the database
  private storage: Card[] = [];

  constructor() {}

  public push(card: Card): void {
    this.storage.push(card);
  }

  public pop(): Card | undefined {
    return this.storage.pop();
  }

  public peek(): Card | undefined {
    return this.storage[this.size() - 1];
  }

  public size(): number {
    return this.storage.length;
  }

  public clearAll(): void {
    while (this.size() > 0) {
      this.storage.pop();
    }
  }
}
