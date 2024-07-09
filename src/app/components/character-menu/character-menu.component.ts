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
import { ItemCardInfoViewComponent } from '../item-card-info-view/item-card-info-view.component';
import { ItemCardInfo } from '../../types/item-card-info';

export type MenuType =
  | 'Weapons'
  | 'Items'
  | 'Spells'
  | 'Statuses'
  | 'Campaign'
  | 'Side-quests'
  | 'Scrolls';
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
    ItemCardInfoViewComponent,
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

  protected showItemMenu: boolean = false;
  protected itemEquipmentToShow: string | undefined;
  protected itemCardInfoToShow: ItemCardInfo | undefined;

  protected cardsLoading: boolean = false;
  protected dropdownOpen: boolean = false;
  protected currentMenu: MenuType = 'Items';
  protected dropdownOptions: MenuType[] = [
    'Items',
    'Weapons',
    'Scrolls',
    'Spells',
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

  protected openItemMenu(itemCard: string) {
    this.itemEquipmentToShow = itemCard;

    this.itemCardInfoToShow = this.itemCardService.getCardInfo(itemCard);

    this.showItemMenu = true;
  }

  protected useItem() {
    // Get rid of the item in the player's inventory

    if (this.itemEquipmentToShow && this.character) {
      const numberOfItemsWithSameName =
        this.character.characterMenu.itemCards.filter(
          (item) => item === this.itemEquipmentToShow
        ).length;

      if (numberOfItemsWithSameName > 1) {
        this.character.characterMenu.itemCards.splice(
          this.character.characterMenu.itemCards.indexOf(
            this.itemEquipmentToShow
          ),
          1
        );
      } else {
        this.character.characterMenu.itemCards =
          this.character.characterMenu.itemCards.filter(
            (item) => item !== this.itemEquipmentToShow
          );
      }

      this.characterService.updateCharacter(this.character, this.gameSessionID);
    }
  }
}
