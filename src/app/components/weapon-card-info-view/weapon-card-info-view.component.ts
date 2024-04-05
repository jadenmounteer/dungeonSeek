import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeaponCardInfo } from '../../types/weapon-card-info';
import { Outcome } from '../../types/card-deck';
import { CommonModule } from '@angular/common';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';

@Component({
  selector: 'app-weapon-card-info-view',
  standalone: true,
  imports: [CommonModule, MenuUnderlineComponent],
  templateUrl: './weapon-card-info-view.component.html',
  styleUrl: './weapon-card-info-view.component.scss',
})
export class WeaponCardInfoViewComponent {
  @Input() public card: WeaponCardInfo | undefined;
  @Output() public closeCard = new EventEmitter<any>();

  protected onCloseCard() {
    this.closeCard.emit();
  }
}
