import {
  Component,
  EventEmitter,
  InputSignal,
  Output,
  input,
} from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { Npc } from '../../types/npc';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attack-menu',
  standalone: true,
  imports: [MenuComponent, MenuUnderlineComponent, CommonModule],
  templateUrl: './attack-menu.component.html',
  styleUrl: './attack-menu.component.scss',
})
export class AttackMenuComponent {
  public npcToAttack: InputSignal<Npc> = input.required();
  @Output() closeMenu = new EventEmitter<any>();
  public viewingWeapons = false;
  public viewingSpells = false;
  public viewingScrolls = false;

  protected onCloseMenu() {
    this.closeMenu.emit();
  }

  public clickWeaponsButton(): void {
    this.viewingWeapons = !this.viewingWeapons;
    this.viewingSpells = false;
    this.viewingScrolls = false;
  }

  public clickSpellsButton(): void {
    this.viewingSpells = !this.viewingSpells;
    this.viewingWeapons = false;
    this.viewingScrolls = false;
  }

  public clickScrollsButton(): void {
    this.viewingScrolls = !this.viewingScrolls;
    this.viewingSpells = false;
    this.viewingWeapons = false;
  }
}
