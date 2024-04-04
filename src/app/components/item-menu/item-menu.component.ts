import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CardInfoComponent } from '../card-info/card-info.component';
import { GameCardComponent } from '../game-card/game-card.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-item-menu',
  standalone: true,
  imports: [CommonModule, MenuComponent, GameCardComponent, CardInfoComponent],
  templateUrl: './item-menu.component.html',
  styleUrl: './item-menu.component.scss',
})
export class ItemMenuComponent {
  @Output() public closeMenu = new EventEmitter<any>();

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
