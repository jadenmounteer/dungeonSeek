import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character, CharacterClass, CharacterSex } from '../../types/character';
import { StatBarComponent } from '../stat-bar/stat-bar.component';
import { CharacterProfileImageComponent } from '../character-profile-image/character-profile-image.component';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [CommonModule, StatBarComponent, CharacterProfileImageComponent],
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
