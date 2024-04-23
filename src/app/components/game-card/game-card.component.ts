import { Component, Input, OnInit } from '@angular/core';
import { EventCardInfo } from '../../types/event-card';
import { WeaponCardInfo } from '../../types/weapon-card-info';
import { ItemCardInfo } from '../../types/item-card-info';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent implements OnInit {
  @Input() card: EventCardInfo | WeaponCardInfo | ItemCardInfo | undefined; // TODO I can make this only require the image url
  @Input() gold: boolean = false; // If this is a gold card, show the gold icon
  @Input() equipped: boolean = false; // If equipment is equipped.

  ngOnInit(): void {
    if (this.card && this.gold) {
      throw new Error('A game card cannot be both a card and gold card.');
    }
  }
}
