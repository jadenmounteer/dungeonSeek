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
  @Output() attack = new EventEmitter<WeaponCardInfo>();

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

  protected attackWithWeapon(weaponInfo: WeaponCardInfo): void {
    // Check if the character has enough stats to make the attack.
    const characterHealth = this.character().characterStats.health.current;
    const characterMana = this.character().characterStats.mana.current;
    const characterStamina = this.character().characterStats.stamina.current;

    const healthCost = weaponInfo.stats.costToUse.healthCost;
    const manaCost = weaponInfo.stats.costToUse.manaCost;
    const staminaCost = weaponInfo.stats.costToUse.healthCost;

    let message: string | undefined;

    if (healthCost > characterHealth) {
      message = 'You do not have enough health to use this weapon.';
    } else if (manaCost > characterMana) {
      message = 'You do not have enough mana to use this weapon.';
    } else if (staminaCost > characterStamina) {
      message = 'You do not have enough stamina to use this weapon.';
    }

    if (message) {
      // TODO replace this with a Toast message
      alert(message);
    } else {
      // Emit the attack event
      this.attack.emit(weaponInfo);
    }
  }
}
