import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { MenuComponent } from '../menu/menu.component';
import { CharacterMenuEquipment } from '../../types/character';
import { WeaponCardService } from '../../services/weapon-card.service';
import { WeaponCardInfo } from '../../types/weapon-card-info';
import { CardAbility, actionAbilitiesMap } from '../../types/card-ability';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-menu-weapon-menu',
  standalone: true,
  imports: [MenuComponent, MenuUnderlineComponent, CommonModule],
  templateUrl: './character-menu-weapon-menu.component.html',
  styleUrl: './character-menu-weapon-menu.component.scss',
  animations: [fadeIn, fadeOut],
})
export class CharacterMenuWeaponMenuComponent implements OnInit {
  @Output() closeMenu = new EventEmitter<any>();
  @Output() toggleEquip = new EventEmitter<any>();
  @Input() cardName!: string;
  @Input() equipped: boolean = false;
  @Input() viewOnly: boolean = false; // If true, the menu will not have the action buttons.

  protected weaponCardInfo: WeaponCardInfo | undefined;
  protected weaponAbility: CardAbility | undefined;

  constructor(private weaponCardService: WeaponCardService) {}

  ngOnInit(): void {
    if (!this.cardName) {
      throw new Error('Card name is required');
    }

    this.getWeaponCardInfo();
    if (this.weaponCardInfo && this.weaponCardInfo.cardAbility) {
      this.weaponAbility = this.setWeaponAbility(
        this.weaponCardInfo.cardAbility
      );
    }
  }

  private getWeaponCardInfo() {
    this.weaponCardInfo = this.weaponCardService.getCardInfo(this.cardName);

    if (!this.weaponCardInfo) {
      throw new Error(`${this.cardName} card not found in weapon deck`);
    }
  }

  private setWeaponAbility(abilityName: string): CardAbility {
    // Get the card ability according to the map
    return actionAbilitiesMap[abilityName];
  }

  protected onCloseMenu() {
    this.closeMenu.emit();
  }

  protected onToggleEquip() {
    this.toggleEquip.emit();
  }
}
