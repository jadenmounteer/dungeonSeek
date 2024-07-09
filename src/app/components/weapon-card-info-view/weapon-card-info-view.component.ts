import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { MenuComponent } from '../menu/menu.component';
import { WeaponCardInfo } from '../../types/weapon-card-info';
import { CardAbility, actionAbilitiesMap } from '../../types/card-ability';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weapon-card-info-view',
  standalone: true,
  imports: [MenuComponent, MenuUnderlineComponent, CommonModule],
  templateUrl: './weapon-card-info-view.html',
  styleUrl: './weapon-card-info-view.scss',
  animations: [fadeIn, fadeOut],
})
export class WeaponCardInfoViewComponent implements OnInit {
  @Output() closeMenu = new EventEmitter<any>();
  @Output() attackWithWeapon = new EventEmitter<any>();
  @Input() cardInfo!: WeaponCardInfo;
  @Input() viewOnly: boolean = false; // If true, the menu will not have the action buttons.

  protected weaponAbility: CardAbility | undefined;

  constructor() {}

  ngOnInit(): void {
    if (!this.cardInfo) {
      throw new Error('Weapon card info is required.');
    }

    if (this.cardInfo.cardAbility) {
      this.weaponAbility = this.setWeaponAbility(this.cardInfo.cardAbility);
    }
  }

  private setWeaponAbility(abilityName: string): CardAbility {
    // Get the card ability according to the map
    return actionAbilitiesMap[abilityName];
  }

  protected onCloseMenu() {
    this.closeMenu.emit();
  }

  protected onAttackWithWeapon() {
    this.attackWithWeapon.emit();
  }
}
