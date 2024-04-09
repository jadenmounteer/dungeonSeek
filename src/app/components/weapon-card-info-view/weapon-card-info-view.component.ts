import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WeaponCardInfo } from '../../types/weapon-card-info';
import { CommonModule } from '@angular/common';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { CardAbility, actionAbilitiesMap } from '../../types/card-ability';

@Component({
  selector: 'app-weapon-card-info-view',
  standalone: true,
  imports: [CommonModule, MenuUnderlineComponent],
  templateUrl: './weapon-card-info-view.component.html',
  styleUrl: './weapon-card-info-view.component.scss',
})
export class WeaponCardInfoViewComponent implements OnInit {
  @Input() public card: WeaponCardInfo | undefined;
  @Output() public closeCard = new EventEmitter<any>();
  protected weaponAbility: CardAbility | undefined;

  ngOnInit(): void {
    if (this.card?.cardAbility) {
      this.weaponAbility = this.setWeaponAbility(this.card.cardAbility);
    }
  }

  private setWeaponAbility(abilityName: string): CardAbility {
    // Get the card ability according to the map
    return actionAbilitiesMap[abilityName];
  }

  protected onCloseCard() {
    this.closeCard.emit();
  }
}
