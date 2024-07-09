import {
  Component,
  EventEmitter,
  InputSignal,
  Output,
  inject,
  input,
} from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import { Npc } from '../../types/npc';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../game-card/game-card.component';
import { WeaponCardService } from '../../services/weapon-card.service';
import { Character } from '../../types/character';
import { fadeIn } from '../../animations/fade-in-animation';

@Component({
  selector: 'app-attack-menu',
  standalone: true,
  imports: [
    MenuComponent,
    MenuUnderlineComponent,
    CommonModule,
    GameCardComponent,
  ],
  templateUrl: './attack-menu.component.html',
  styleUrl: './attack-menu.component.scss',
  animations: [fadeIn],
})
export class AttackMenuComponent {
  public weaponCardService: WeaponCardService = inject(WeaponCardService);
  public npcToAttack: InputSignal<Npc> = input.required();
  public character: InputSignal<Character> = input.required();

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
