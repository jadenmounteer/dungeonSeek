import { Component, Input, OnInit } from '@angular/core';
import { CharacterStat } from '../../types/character';

export type StatColor = 'red' | 'blue' | 'green' | 'dark-blue';
@Component({
  selector: 'app-stat-bar',
  standalone: true,
  imports: [],
  templateUrl: './stat-bar.component.html',
  styleUrl: './stat-bar.component.scss',
})
export class StatBarComponent implements OnInit {
  @Input() stat!: CharacterStat;
  @Input() statName!: string;
  @Input() statColor: StatColor = 'red';

  ngOnInit(): void {
    if (!this.stat || !this.statName) {
      throw new Error('StatBarComponent is missing a required input.');
    }
  }
}
