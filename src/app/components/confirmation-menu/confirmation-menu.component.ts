import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-menu',
  standalone: true,
  imports: [MenuComponent, CommonModule],
  templateUrl: './confirmation-menu.component.html',
  styleUrl: './confirmation-menu.component.scss',
})
export class ConfirmationMenuComponent {
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Input() message: string = '';

  protected onCloseMenu() {
    this.closeMenu.emit();
  }

  protected onConfirm() {
    this.confirm.emit();
  }
}
