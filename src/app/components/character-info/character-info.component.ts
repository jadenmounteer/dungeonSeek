import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../../types/character';
import { CharacterProfileImageComponent } from '../character-profile-image/character-profile-image.component';
import { CharacterStatsComponent } from '../character-stats/character-stats.component';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [CharacterProfileImageComponent, CharacterStatsComponent],
  templateUrl: './character-info.component.html',
  styleUrl: './character-info.component.scss',
})
export class CharacterInfoComponent {
  @Input() character!: Character;
  @Output() showCharacterMenu = new EventEmitter<void>();

  protected toggleCharacterMenu(): void {
    this.showCharacterMenu.emit();
  }
}
