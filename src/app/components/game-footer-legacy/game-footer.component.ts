import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToggleMenuButtonComponent } from '../toggle-menu-button/toggle-menu-button.component';

@Component({
  selector: 'app-game-footer',
  standalone: true,
  imports: [CommonModule, ToggleMenuButtonComponent],
  templateUrl: './game-footer.component.html',
  styleUrl: './game-footer.component.scss',
})
export class GameFooterComponent {
  @Input() public characterMovementSpeed: number | undefined;
  @Input() public turnNumber!: number;
  @Input() public waitingForOnlinePlayersToFinishTurn: boolean = false;
  @Input() public characterName: string | undefined;
  @Output() protected endTurn: EventEmitter<any> = new EventEmitter();
  @Output() protected drawEventCard: EventEmitter<any> = new EventEmitter();

  protected menuOpen: boolean = true;

  protected onEndTurn() {
    if (!this.waitingForOnlinePlayersToFinishTurn) {
      this.endTurn.emit();
    }
  }

  protected onDrawEventCard() {
    if (!this.waitingForOnlinePlayersToFinishTurn) {
      this.drawEventCard.emit();
    }
  }
}
