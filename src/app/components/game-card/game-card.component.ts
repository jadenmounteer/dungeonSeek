import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'rotateY(179deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
        })
      ),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in')),
    ]),
  ],
})
export class GameCardComponent implements OnInit {
  protected flip: string = 'inactive';

  toggleFlip() {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
  }

  ngOnInit(): void {
    this.flipCard();
  }

  private flipCard() {
    // flip the card after 5 seconds
    setTimeout(() => {
      // flip the card
      this.toggleFlip();
    }, 5000);
  }
}
