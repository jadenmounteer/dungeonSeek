import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { GameCardComponent } from '../game-card/game-card.component';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';

@Component({
  selector: 'app-gold-menu',
  standalone: true,
  imports: [MenuComponent, GameCardComponent, MenuUnderlineComponent],
  templateUrl: './gold-menu.component.html',
  styleUrl: './gold-menu.component.scss',
})
export class GoldMenuComponent {
  @Input() public goldAmount: number = 0;
  @Output() public closeMenu = new EventEmitter<any>();

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
