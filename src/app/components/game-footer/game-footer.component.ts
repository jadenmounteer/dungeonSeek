import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-footer.component.html',
  styleUrl: './game-footer.component.scss',
})
export class GameFooterComponent {
  @Input() public characterMovementSpeed: number | undefined;
  @Input() public turnNumber!: number;
  @Output() protected endTurn: EventEmitter<any> = new EventEmitter();

  protected onEndTurn() {
    this.endTurn.emit();
  }
}
