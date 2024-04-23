import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { MenuComponent } from '../menu/menu.component';
import { CharacterMenuEquipment } from '../../types/character';

@Component({
  selector: 'app-character-menu-weapon-menu',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './character-menu-weapon-menu.component.html',
  styleUrl: './character-menu-weapon-menu.component.scss',
  animations: [fadeIn, fadeOut],
})
export class CharacterMenuWeaponMenuComponent implements OnInit {
  @Output() closeMenu = new EventEmitter<any>();
  @Input() weaponEquipment!: CharacterMenuEquipment;

  ngOnInit(): void {
    if (!this.weaponEquipment) {
      throw new Error('Weapon Equipment is required');
    }
  }

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
