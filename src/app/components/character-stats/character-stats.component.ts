import { Component, input, Input, InputSignal } from '@angular/core';
import { StatBarComponent } from '../stat-bar/stat-bar.component';
import { Character } from '../../types/character';
import { CommonModule } from '@angular/common';
import { LocationInfoComponent } from '../location-info/location-info.component';

@Component({
  selector: 'app-character-stats',
  standalone: true,
  imports: [StatBarComponent, CommonModule, LocationInfoComponent],
  templateUrl: './character-stats.component.html',
  styleUrl: './character-stats.component.scss',
})
export class CharacterStatsComponent {
  public character: InputSignal<Character> = input.required();
}
