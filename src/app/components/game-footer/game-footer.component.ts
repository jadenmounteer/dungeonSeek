import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-footer',
  standalone: true,
  imports: [],
  templateUrl: './game-footer.component.html',
  styleUrl: './game-footer.component.scss',
})
export class GameFooterComponent {
  @Input() public characterMovementSpeed: number | undefined;
}
