import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../../types/character';
import { MenuComponent } from '../menu/menu.component';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { CharacterProfileImageComponent } from '../character-profile-image/character-profile-image.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-menu',
  standalone: true,
  imports: [
    MenuComponent,
    MenuUnderlineComponent,
    CharacterProfileImageComponent,
    CommonModule,
  ],
  templateUrl: './character-menu.component.html',
  styleUrl: './character-menu.component.scss',
})
export class CharacterMenuComponent {
  @Input() character: Character | undefined;
  @Output() closeMenu = new EventEmitter<any>();

  protected onCloseMenu() {
    this.closeMenu.emit();
  }
}
