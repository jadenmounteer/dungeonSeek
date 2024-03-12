import { Injectable } from '@angular/core';
import { CardName } from './card.service';

interface CardStack<CardName> {
  push(item: CardName): void;
  pop(): CardName | undefined;
  peek(): CardName | undefined;
  size(): number;
}

@Injectable({
  providedIn: 'root',
})
export class CardDeckService implements CardStack<string> {
  private storage: CardName[] = [];

  constructor() {}
  public push(cardName: CardName): void {
    this.storage.push(cardName);
  }

  public pop(): CardName | undefined {
    return this.storage.pop();
  }

  public peek(): CardName | undefined {
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
