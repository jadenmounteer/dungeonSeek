import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { CardService } from '../../services/card.service';
import { LocationType } from '../../services/location-service';
import { Card, CardName } from '../../types/card-deck';
@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'rotateY(179deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
        })
      ),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in')),
    ]),
    fadeIn,
    fadeOut,
  ],
})
export class GameCardComponent implements OnInit {
  @Input() public cardName: CardName | undefined;
  @Input() public locationType: LocationType | undefined;
  @Output() public closeCard = new EventEmitter<CardName>();

  protected flip: string = 'inactive';
  protected card: Card | undefined;

  constructor(private cardService: CardService) {}

  toggleFlip() {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
  }

  ngOnInit(): void {
    console.log(this.cardName);
    console.log(this.locationType);
    if (!this.cardName || !this.locationType) {
      throw new Error('Card name or location type not provided');
    }
    // const card = this.cardService.getCard(this.cardName, this.locationType);
    // if (card) {
    //   this.card = card;
    // } else {
    //   throw new Error('Card not found');
    // }
    this.flipCard();
  }

  private flipCard() {
    // flip the card after 5 seconds
    setTimeout(() => {
      // flip the card
      this.toggleFlip();
    }, 1000);
  }

  protected onCloseCard() {
    this.closeCard.emit(this.cardName);
  }
}
