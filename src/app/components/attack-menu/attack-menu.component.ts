import {
  Component,
  EventEmitter,
  InputSignal,
  Output,
  inject,
  input,
} from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { Npc } from '../../types/npc';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../game-card/game-card.component';
import { WeaponCardService } from '../../services/weapon-card.service';
import { Character, CharacterMenuEquipment } from '../../types/character';
import { fadeIn } from '../../animations/fade-in-animation';
import { WeaponCardInfoViewComponent } from '../weapon-card-info-view/weapon-card-info-view.component';
import { WeaponCardInfo } from '../../types/weapon-card-info';

@Component({
  selector: 'app-attack-menu',
  standalone: true,
  imports: [
    MenuComponent,
    MenuUnderlineComponent,
    CommonModule,
    GameCardComponent,
    WeaponCardInfoViewComponent,
  ],
  templateUrl: './attack-menu.component.html',
  styleUrl: './attack-menu.component.scss',
  animations: [fadeIn],
})
export class AttackMenuComponent {
  public weaponCardService: WeaponCardService = inject(WeaponCardService);
  public npcToAttack: InputSignal<Npc> = input.required();
  public character: InputSignal<Character> = input.required();
  protected weaponEquipmentToShow: CharacterMenuEquipment | undefined;
  protected weaponCardInfoToShow: WeaponCardInfo | undefined;
  protected showWeaponMenu = false;

  @Output() closeMenu = new EventEmitter<any>();

  public viewingWeapons = false;
  public viewingSpells = false;
  public viewingScrolls = false;

  protected onCloseMenu() {
    this.closeMenu.emit();
  }

  public clickWeaponsButton(): void {
    this.viewingWeapons = !this.viewingWeapons;
    this.viewingSpells = false;
    this.viewingScrolls = false;
  }

  public clickSpellsButton(): void {
    this.viewingSpells = !this.viewingSpells;
    this.viewingWeapons = false;
    this.viewingScrolls = false;
  }

  public clickScrollsButton(): void {
    this.viewingScrolls = !this.viewingScrolls;
    this.viewingSpells = false;
    this.viewingWeapons = false;
  }

  protected openWeaponMenu(weaponCard: CharacterMenuEquipment) {
    this.weaponEquipmentToShow = weaponCard;

    this.weaponCardInfoToShow = this.weaponCardService.getCardInfo(
      weaponCard.cardName
    );

    this.showWeaponMenu = true;
  }

  protected attackWithWeapon(): void {
    // TODO implement this method
    alert('Method not implemented');
  }
}
