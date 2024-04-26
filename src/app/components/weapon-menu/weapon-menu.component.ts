import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { GameCardComponent } from '../game-card/game-card.component';
import { MenuComponent } from '../menu/menu.component';
import { WeaponCardInfoViewComponent } from '../weapon-card-info-view/weapon-card-info-view.component';
import { WeaponCardInfo } from '../../types/weapon-card-info';
import { WeaponCardService } from '../../services/weapon-card.service';
import { CharacterMenuWeaponMenuComponent } from '../character-menu-weapon-menu/character-menu-weapon-menu.component';

@Component({
  selector: 'app-weapon-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    GameCardComponent,
    WeaponCardInfoViewComponent,
    CharacterMenuWeaponMenuComponent,
  ],
  templateUrl: './weapon-menu.component.html',
  styleUrl: './weapon-menu.component.scss',
})
export class WeaponMenuComponent implements OnInit {
  @Input() public cardName: string | undefined;
  @Output() public closeMenu = new EventEmitter<any>();
  protected card: WeaponCardInfo | undefined;
  protected showWeaponMenu = false;

  constructor(private weaponCardService: WeaponCardService) {}

  ngOnInit(): void {
    if (!this.cardName) {
      throw new Error('Weapon card name not provided');
    }
    const card = this.weaponCardService.getCardInfo(this.cardName);
    if (card) {
      this.card = card;
    } else {
      throw new Error(`${this.cardName} card not found in weapon deck`);
    }
  }

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
