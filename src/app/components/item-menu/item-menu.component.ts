import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameCardComponent } from '../game-card/game-card.component';
import { MenuComponent } from '../menu/menu.component';
import { ItemCardInfo } from '../../types/item-card-info';
import { ItemCardInfoViewComponent } from '../item-card-info-view/item-card-info-view.component';

@Component({
  selector: 'app-item-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    GameCardComponent,
    ItemCardInfoViewComponent,
  ],
  templateUrl: './item-menu.component.html',
  styleUrl: './item-menu.component.scss',
})
export class ItemMenuComponent {
  @Input() public cardName: string | undefined;
  @Output() public closeMenu = new EventEmitter<any>();
  protected card: ItemCardInfo | undefined;

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
