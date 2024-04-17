import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character, CharacterClass, CharacterSex } from '../../types/character';
import { StatBarComponent } from '../stat-bar/stat-bar.component';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [CommonModule, StatBarComponent],
  templateUrl: './character-info.component.html',
  styleUrl: './character-info.component.scss',
})
export class CharacterInfoComponent {
  @Input() character!: Character;
  @Output() showCharacterMenu = new EventEmitter<void>();

  protected characterImage: string = '';

  ngOnChanges() {
    this.setCharacterImage();
  }

  private setCharacterImage(): void {
    const characterClass = this.character?.class;
    const characterSex = this.character.sex;

    if (characterSex === 'Male') {
      this.characterImage = this.getMaleCharacterClassImage(characterClass);
    } else {
      this.characterImage = this.getFemaleCharacterClassImage(characterClass);
    }
  }

  private getMaleCharacterClassImage(characterClass: CharacterClass): string {
    switch (characterClass) {
      case 'Sorcerer':
        return 'assets/character-profile-images/wizard-profile.png';

      default:
        return 'assets/character-profile-images/wizard-profile.png';
    }
  }

  private getFemaleCharacterClassImage(characterClass: CharacterClass): string {
    switch (characterClass) {
      case 'Sorcerer':
        return 'assets/character-profile-images/sorceress-profile.png';
      case 'Pirate':
        return 'assets/character-profile-images/female-pirate-profile.png';

      default:
        return 'assets/character-profile-images/sorceress-profile.png';
    }
  }

  protected toggleCharacterMenu(): void {
    this.showCharacterMenu.emit();
  }
}
