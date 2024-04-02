import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardService } from '../../services/card.service';
import { CardInfo, DeckName, Outcome } from '../../types/card-deck';
import { MenuComponent } from '../menu/menu.component';
@Component({
  selector: 'app-event-menu',
  standalone: true,
  imports: [CommonModule, MenuComponent],
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

  toggleFlip() {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
  }

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
    this.closeCard.emit();
  }

  protected onMakeChoice(choice: Outcome) {
    this.makeChoice.emit(choice);
  }
}
