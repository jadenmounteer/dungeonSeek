import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardService } from '../../services/card.service';
import { CardInfo, DeckName, Outcome } from '../../types/card-deck';
import { MenuComponent } from '../menu/menu.component';
import { GameCardComponent } from '../game-card/game-card.component';
@Component({
  selector: 'app-event-menu',
  standalone: true,
  imports: [CommonModule, MenuComponent, GameCardComponent],
  templateUrl: './event-menu.component.html',
  styleUrl: './event-menu.component.scss',
})
export class EventMenuComponent implements OnInit {
  @Input() public cardName: string | undefined;
  @Input() public deckName: DeckName | undefined;
  @Output() public closeCard = new EventEmitter<any>();
  @Output() public makeChoice = new EventEmitter<Outcome>();

  protected flip: string = 'inactive';
  protected card: CardInfo | undefined;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    if (!this.cardName || !this.deckName) {
      throw new Error('Card name or location type not provided');
    }
    const card = this.cardService.getCardInfo(this.cardName, this.deckName);
    if (card) {
      this.card = card;
    } else {
      throw new Error('Card not found');
    }
  }

  protected onCloseCard() {
    this.closeCard.emit();
  }

  protected onMakeChoice(choice: Outcome) {
    this.makeChoice.emit(choice);
  }
}
