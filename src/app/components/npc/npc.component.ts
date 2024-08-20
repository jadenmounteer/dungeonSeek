import {
  Component,
  EventEmitter,
  InputSignal,
  OnInit,
  Output,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Npc } from '../../types/npcs/npc';
import { DeadIconComponent } from '../dead-icon/dead-icon.component';

/**
 * This component is responsible for rendering an NPC and handling its interactions with the world.
 */
@Component({
  selector: 'app-npc',
  standalone: true,
  imports: [CommonModule, DeadIconComponent],
  templateUrl: './npc.component.html',
  styleUrl: './npc.component.scss',
})
export class NpcComponent implements OnInit {
  public npc: InputSignal<Npc> = input.required();
  public selectable: InputSignal<boolean> = input.required();
  public selected: InputSignal<boolean> = input.required();
  @Output() npcSelected = new EventEmitter<Npc>();

  public dead = computed(() => this.npc().npcStats.health.current <= 0);

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
