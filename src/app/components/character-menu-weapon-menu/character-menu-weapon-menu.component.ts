import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { MenuComponent } from '../menu/menu.component';
import { CharacterMenuEquipment } from '../../types/character';
import { WeaponCardService } from '../../services/weapon-card.service';
import { WeaponCardInfo } from '../../types/weapon-card-info';

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

  protected weaponCardInfo: WeaponCardInfo | undefined;

  constructor(private weaponCardService: WeaponCardService) {}

  ngOnInit(): void {
    if (!this.weaponEquipment) {
      throw new Error('Weapon Equipment is required');
    }

    this.getWeaponCardInfo();
  }

  private getWeaponCardInfo() {
    this.weaponCardInfo = this.weaponCardService.getCardInfo(
      this.weaponEquipment.cardName
    );

    if (!this.weaponCardInfo) {
      throw new Error(
        `${this.weaponEquipment.cardName} card not found in weapon deck`
      );
    }
  }

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
