import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { GameCardComponent } from '../game-card/game-card.component';
import { MenuComponent } from '../menu/menu.component';
import { WeaponCardInfoViewComponent } from '../weapon-card-info-view/weapon-card-info-view.component';

@Component({
  selector: 'app-weapon-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    GameCardComponent,
    WeaponCardInfoViewComponent,
  ],
  templateUrl: './weapon-menu.component.html',
  styleUrl: './weapon-menu.component.scss',
})
export class WeaponMenuComponent {
  @Output() public closeMenu = new EventEmitter<any>();

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
