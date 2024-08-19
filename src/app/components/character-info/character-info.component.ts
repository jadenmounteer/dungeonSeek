import {
  Component,
  EventEmitter,
  Input,
  InputSignal,
  OnDestroy,
  Output,
  inject,
  input,
} from '@angular/core';
import { Character } from '../../types/character';
import { CharacterProfileImageComponent } from '../character-profile-image/character-profile-image.component';
import { CharacterStatsComponent } from '../character-stats/character-stats.component';
import { CombatService } from '../../services/combat.service';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [CharacterProfileImageComponent, CharacterStatsComponent],
  templateUrl: './character-info.component.html',
  styleUrl: './character-info.component.scss',
})
export class CharacterInfoComponent implements OnDestroy {
  public character: InputSignal<Character> = input.required();
  @Output() showCharacterMenu = new EventEmitter<void>();
  private combatService: CombatService = inject(CombatService);

  private npcDealtDamageToCurrentPlayerSub =
    this.combatService.npcDealtDamageToCurrentPlayer$.subscribe(
      (damageReceived) => {
        // TODO in the future I can make enemies deal damage to magika and stamina as well.
        // For now it is just health.
        this.character().characterStats.health.current -= damageReceived;
      }
    );

  protected toggleCharacterMenu(): void {
    this.showCharacterMenu.emit();
  }

  ngOnDestroy() {
    this.npcDealtDamageToCurrentPlayerSub.unsubscribe();
  }
}
