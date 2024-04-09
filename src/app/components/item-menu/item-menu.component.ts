import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameCardComponent } from '../game-card/game-card.component';
import { MenuComponent } from '../menu/menu.component';
import { ItemCardInfo } from '../../types/item-card-info';
import { ItemCardInfoViewComponent } from '../item-card-info-view/item-card-info-view.component';
import { ItemCardService } from '../../services/item-card.service';

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
export class ItemMenuComponent implements OnInit {
  @Input() public cardName: string | undefined;
  @Output() public closeMenu = new EventEmitter<any>();
  protected card: ItemCardInfo | undefined;

  constructor(private itemCardService: ItemCardService) {}

  ngOnInit(): void {
    if (!this.cardName) {
      throw new Error('Item card name not provided');
    }
    const card = this.itemCardService.getItemCardInfo(this.cardName);
    if (card) {
      this.card = card;
    } else {
      throw new Error(`${this.cardName} card not found in item deck`);
    }
  }

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
