import { Component, EventEmitter, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-character-menu-weapon-menu',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './character-menu-weapon-menu.component.html',
  styleUrl: './character-menu-weapon-menu.component.scss',
  animations: [fadeIn, fadeOut],
})
export class CharacterMenuWeaponMenuComponent {
  @Output() closeMenu = new EventEmitter<any>();

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
