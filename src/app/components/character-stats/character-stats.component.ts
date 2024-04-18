import { Component, Input } from '@angular/core';
import { StatBarComponent } from '../stat-bar/stat-bar.component';
import { Character } from '../../types/character';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-stats',
  standalone: true,
  imports: [StatBarComponent, CommonModule],
  templateUrl: './character-stats.component.html',
  styleUrl: './character-stats.component.scss',
})
export class CharacterStatsComponent {
  @Input() character!: Character;
}
