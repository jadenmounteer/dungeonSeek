import {
  Component,
  EventEmitter,
  InputSignal,
  OnInit,
  Output,
  input,
} from '@angular/core';
import { Npc } from '../../types/npc';
import { CommonModule } from '@angular/common';
import { CombatSession } from '../../services/combat.service';

/**
 * This component is responsible for rendering an NPC and handling its interactions with the world.
 */
@Component({
  selector: 'app-npc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './npc.component.html',
  styleUrl: './npc.component.scss',
})
export class NpcComponent implements OnInit {
  public npc: InputSignal<Npc> = input.required();
  public selectable: InputSignal<boolean> = input.required();
  public selected: InputSignal<boolean> = input.required();
  @Output() npcSelected = new EventEmitter<Npc>();

  public inCombat = false;

  public ngOnInit(): void {
    this.inCombat = this.npc().combatSessionID !== null;
  }

  public selectNpc(): void {
    if (this.selectable()) {
      this.npcSelected.emit(this.npc());
    }
  }
}
