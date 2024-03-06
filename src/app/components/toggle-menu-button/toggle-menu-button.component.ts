import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toggle-menu-button',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './toggle-menu-button.component.html',
  styleUrl: './toggle-menu-button.component.scss',
})
export class ToggleMenuButtonComponent {
  @Output() public toggleMenu: EventEmitter<any> = new EventEmitter();
  protected menuOpen: boolean = true;

  protected onToggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.toggleMenu.emit();
  }
}
