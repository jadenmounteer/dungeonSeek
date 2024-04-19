import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { CommonModule, DOCUMENT } from '@angular/common';

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

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.disableBodyScroll();
  }
  protected onCloseMenu() {
    this.enableBodyScroll();
    this.closeMenu.emit();
  }

  protected enableBodyScroll() {
    this.document.body.style.overflow = 'auto';
  }
  protected disableBodyScroll() {
    this.document.body.style.overflow = 'hidden';
  }
}
