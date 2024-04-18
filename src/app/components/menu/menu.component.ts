import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [fadeIn, fadeOut],
})
export class MenuComponent {
  @Output() closeMenu = new EventEmitter<any>();
  @Input() showCloseMenu: boolean = false;

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
