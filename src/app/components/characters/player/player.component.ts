import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Character } from '../../../types/character';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  @Input() directionFacing: 'Right' | 'Left' = 'Right';
  @Input() character!: Character;

  constructor() {}
  ngOnInit(): void {
    if (!this.character) {
      throw new Error('Character is required');
    }
  }
}
