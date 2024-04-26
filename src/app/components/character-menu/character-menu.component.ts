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
import { CharacterService } from '../../services/character/character.service';
import { WeaponCardInfoViewComponent } from '../weapon-card-info-view/weapon-card-info-view.component';

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
    WeaponCardInfoViewComponent,
  ],
  templateUrl: './character-menu.component.html',
  styleUrl: './character-menu.component.scss',
  animations: [fadeIn],
})
export class CharacterMenuComponent implements OnInit {
  @Input() character: Character | undefined;
  @Input() gameSessionID!: string;
  @Output() closeMenu = new EventEmitter<any>();

  protected showWeaponMenu: boolean = false;
  protected weaponEquipmentToShow: CharacterMenuEquipment | undefined;
  protected weaponCardInfoToShow: WeaponCardInfo | undefined;

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
    protected itemCardService: ItemCardService,
    protected characterService: CharacterService
  ) {}

  public ngOnInit(): void {
    if (!this.gameSessionID) {
      throw new Error('Game session ID not provided');
    }

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

  protected openWeaponMenu(weaponCard: CharacterMenuEquipment) {
    this.weaponEquipmentToShow = weaponCard;

    this.weaponCardInfoToShow = this.weaponCardService.getCardInfo(
      weaponCard.cardName
    );

    this.showWeaponMenu = true;
  }

  protected toggleWeaponEquip(): void {
    if (this.weaponEquipmentToShow) {
      this.weaponEquipmentToShow.equipped =
        !this.weaponEquipmentToShow.equipped;

      // If we equipped the weapon, unequip all other weapons
      if (this.weaponEquipmentToShow.equipped) {
        this.character?.characterMenu.weaponCards.forEach((card) => {
          if (card !== this.weaponEquipmentToShow) {
            card.equipped = false;
          }
        });
      }

      if (this.character) {
        // Save the character to the database
        this.characterService.updateCharacter(
          this.character,
          this.gameSessionID
        );

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
