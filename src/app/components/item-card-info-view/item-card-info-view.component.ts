import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemCardInfo } from '../../types/item-card-info';
import { CardAbility, actionAbilitiesMap } from '../../types/card-ability';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-card-info-view',
  standalone: true,
  imports: [CommonModule, MenuUnderlineComponent],
  templateUrl: './item-card-info-view.component.html',
  styleUrl: './item-card-info-view.component.scss',
})
export class ItemCardInfoViewComponent implements OnInit {
  @Input() public card: ItemCardInfo | undefined;
  @Output() public closeCard = new EventEmitter<any>();
  protected itemAbility: CardAbility | undefined;

  ngOnInit(): void {
    if (this.card?.cardAbility) {
      this.itemAbility = this.setItemAbility(this.card.cardAbility);
    }
  }

  private setItemAbility(abilityName: string): CardAbility {
    // Get the card ability according to the map
    return actionAbilitiesMap[abilityName];
  }

  protected onCloseCard() {
    this.closeCard.emit();
  }
}
