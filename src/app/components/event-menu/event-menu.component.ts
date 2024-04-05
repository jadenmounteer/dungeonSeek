import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeckName, Outcome } from '../../types/card-deck';
import { MenuComponent } from '../menu/menu.component';
import { GameCardComponent } from '../game-card/game-card.component';
import { EventCardInfoViewComponent } from '../event-card-info-view/event-card-info-view.component';
import { EventCardInfo } from '../../types/event-card';
import { EventCardService } from '../../services/event-card.service';
@Component({
  selector: 'app-event-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    GameCardComponent,
    EventCardInfoViewComponent,
  ],
  templateUrl: './event-menu.component.html',
  styleUrl: './event-menu.component.scss',
})
export class EventMenuComponent implements OnInit {
  @Input() public cardName: string | undefined;
  @Input() public deckName: DeckName | undefined;
  @Output() public closeCard = new EventEmitter<any>();
  @Output() public makeChoice = new EventEmitter<Outcome>();

  protected flip: string = 'inactive';
  protected card: EventCardInfo | undefined;

  constructor(private eventCardService: EventCardService) {}

  ngOnInit(): void {
    if (!this.cardName || !this.deckName) {
      throw new Error('Card name or location type not provided');
    }
    const card = this.eventCardService.getEventCardInfo(
      this.cardName,
      this.deckName
    );
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
