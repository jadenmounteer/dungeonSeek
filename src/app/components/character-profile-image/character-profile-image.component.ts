import { Component, Input } from '@angular/core';
import { Character, CharacterClass } from '../../types/character';

@Component({
  selector: 'app-character-profile-image',
  standalone: true,
  imports: [],
  templateUrl: './character-profile-image.component.html',
  styleUrl: './character-profile-image.component.scss',
})
export class CharacterProfileImageComponent {
  @Input() character!: Character;
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
}
