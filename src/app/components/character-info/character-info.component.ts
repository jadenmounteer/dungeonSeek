import {
  Component,
  EventEmitter,
  Input,
  InputSignal,
  Output,
  input,
} from '@angular/core';
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
  public character: InputSignal<Character> = input.required();
  @Output() showCharacterMenu = new EventEmitter<void>();

  protected toggleCharacterMenu(): void {
    this.showCharacterMenu.emit();
  }
}
