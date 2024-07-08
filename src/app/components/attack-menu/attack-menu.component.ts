import { Component, EventEmitter, Output } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';

@Component({
  selector: 'app-attack-menu',
  standalone: true,
  imports: [MenuComponent, MenuUnderlineComponent],
  templateUrl: './attack-menu.component.html',
  styleUrl: './attack-menu.component.scss',
})
export class AttackMenuComponent {
  @Output() closeMenu = new EventEmitter<any>();

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
