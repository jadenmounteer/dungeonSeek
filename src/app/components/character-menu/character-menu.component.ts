import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Character, CharacterMenuEquipment } from '../../types/character';
import { MenuComponent } from '../menu/menu.component';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { CharacterProfileImageComponent } from '../character-profile-image/character-profile-image.component';
import { CommonModule } from '@angular/common';
import { CharacterStatsComponent } from '../character-stats/character-stats.component';
import { GameCardComponent } from '../game-card/game-card.component';
import { LoadingIconComponent } from '../loading-icon/loading-icon.component';
import { WeaponCardInfo } from '../../types/weapon-card-info';
import { WeaponCardService } from '../../services/weapon-card.service';
import { ItemCardService } from '../../services/item-card.service';
import { fadeIn } from '../../animations/fade-in-animation';
import { CharacterMenuWeaponMenuComponent } from '../character-menu-weapon-menu/character-menu-weapon-menu.component';

export type MenuType =
  | 'Weapons'
  | 'Items'
  | 'Spells'
  | 'Statuses'
  | 'Campaign'
  | 'Side-quests';
@Component({
  selector: 'app-character-menu',
  standalone: true,
  imports: [
    MenuComponent,
    MenuUnderlineComponent,
    CharacterProfileImageComponent,
    CommonModule,
    CharacterStatsComponent,
    GameCardComponent,
    LoadingIconComponent,
    CharacterMenuWeaponMenuComponent,
  ],
  templateUrl: './character-menu.component.html',
  styleUrl: './character-menu.component.scss',
  animations: [fadeIn],
})
export class CharacterMenuComponent implements OnInit {
  @Input() character: Character | undefined;
  @Output() closeMenu = new EventEmitter<any>();

  protected showWeaponMenu: boolean = true;
  protected weaponEquipmentToShow: CharacterMenuEquipment | undefined;

  protected cardsLoading: boolean = false;
  protected dropdownOpen: boolean = false;
  protected currentMenu: MenuType = 'Items';
  protected dropdownOptions: MenuType[] = [
    'Items',
    'Weapons',
    'Side-quests',
    'Campaign',
    'Statuses',
  ];

  protected mapOfWeaponCardInfo: { [key: string]: WeaponCardInfo } = {};

  constructor(
    protected weaponCardService: WeaponCardService,
    protected itemCardService: ItemCardService
  ) {}

  public ngOnInit(): void {
    if (this.character) {
      this.sortEquipmentCards(this.character.characterMenu.weaponCards);
      // TODO sort the other equippment cards
    }
  }

  protected onCloseMenu() {
    this.closeMenu.emit();
  }

  protected toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  protected changeVisibleMenu(newMenu: MenuType) {
    this.currentMenu = newMenu;
    this.toggleDropdown();
  }

  protected toggleWeaponEquip(): void {
    if (this.weaponEquipmentToShow) {
      this.weaponEquipmentToShow.equipped =
        !this.weaponEquipmentToShow.equipped;

      if (this.character) {
        this.sortEquipmentCards(this.character.characterMenu.weaponCards);
      }
    }
  }

  private sortEquipmentCards(cardsToSort: CharacterMenuEquipment[]): void {
    cardsToSort.sort((a, b) => {
      // Shows equipped cards first
      if (a.equipped && !b.equipped) {
        return -1;
      }
      if (!a.equipped && b.equipped) {
        return 1;
      }
      return 0;
    });
  }
}
