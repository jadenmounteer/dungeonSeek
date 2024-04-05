import { Injectable } from '@angular/core';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root',
})
export class EventCardService {
  constructor(cardService: CardService) {}
}
