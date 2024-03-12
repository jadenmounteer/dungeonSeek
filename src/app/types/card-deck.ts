import { Injectable } from '@angular/core';
import { CardName } from '../services/card.service';
export interface CardStack<CardName> {
  push(item: CardName): void;
  pop(): CardName | undefined;
  peek(): CardName | undefined;
  size(): number;
}
