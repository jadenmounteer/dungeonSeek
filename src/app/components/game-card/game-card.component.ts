import { Component, Input } from '@angular/core';
import { EventCardInfo } from '../../types/event-card';
import { WeaponCardInfo } from '../../types/weapon-card-info';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
  @Input() card: EventCardInfo | WeaponCardInfo | undefined;
}
