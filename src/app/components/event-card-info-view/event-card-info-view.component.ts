import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardInfo, Outcome } from '../../types/card-deck';
import { CommonModule } from '@angular/common';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';

@Component({
  selector: 'app-event-card-info-view',
  standalone: true,
  imports: [CommonModule, MenuUnderlineComponent],
  templateUrl: './event-card-info-view.component.html',
  styleUrl: './event-card-info-view.component.scss',
})
export class EventCardInfoViewComponent {
  @Input() public card: CardInfo | undefined;
  @Output() public closeCard = new EventEmitter<any>();
  @Output() public makeChoice = new EventEmitter<Outcome>();

  protected onCloseCard() {
    this.closeCard.emit();
  }

  protected onMakeChoice(choice: Outcome) {
    this.makeChoice.emit(choice);
  }
}
