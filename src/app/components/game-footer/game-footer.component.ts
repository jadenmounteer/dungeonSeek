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
  @Output() protected endTurn: EventEmitter<any> = new EventEmitter();

  @Input() public characterName: string | undefined;

  protected onEndTurn() {
    if (!this.waitingForOnlinePlayersToFinishTurn) {
      this.endTurn.emit();
    }
  }
}
