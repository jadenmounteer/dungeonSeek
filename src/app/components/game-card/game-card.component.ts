import { Component, Input } from '@angular/core';
import { CardInfo } from '../../types/card-deck';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
  @Input() card: CardInfo | undefined;
}
