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
  @Input() public cardInfo!: ItemCardInfo;
  @Input() public viewOnly: boolean = false; // If true, the menu will not have the action buttons.
  @Output() public closeCard = new EventEmitter<any>();
  @Output() useItem = new EventEmitter<any>();

  protected itemAbility: CardAbility | undefined;

  ngOnInit(): void {
    if (!this.cardInfo) {
      throw new Error('Item card info is required.');
    }

    if (this.cardInfo?.cardAbility) {
      this.itemAbility = this.setItemAbility(this.cardInfo.cardAbility);
    }
  }

  private setItemAbility(abilityName: string): CardAbility {
    // Get the card ability according to the map
    return actionAbilitiesMap[abilityName];
  }

  protected onCloseCard() {
    this.closeCard.emit();
  }

  protected onUse(): void {
    this.useItem.emit();
  }
}
