import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CharacterStat } from '../../types/character';
import { CommonModule } from '@angular/common';

export type StatName = 'Health' | 'Mana' | 'Stamina' | 'Experience';
@Component({
  selector: 'app-stat-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-bar.component.html',
  styleUrl: './stat-bar.component.scss',
})
export class StatBarComponent implements OnInit {
  @Input() stat!: CharacterStat;
  @Input() statName!: StatName;

  ngOnInit(): void {
    if (!this.stat || !this.statName) {
      throw new Error('StatBarComponent is missing a required input.');
    }
  }
}
