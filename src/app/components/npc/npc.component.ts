import {
  Component,
  InputSignal,
  OnInit,
  Signal,
  computed,
  inject,
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
  public combatSessions: InputSignal<CombatSession[]> = input.required();

  public inCombat: Signal<boolean> = computed(() => {
    return this.combatSessions().some((combatSession) => {
      return (
        combatSession.playerIDs.includes(this.npc().id) ||
        combatSession.enemyIDs.includes(this.npc().id)
      );
    });
  });

  public ngOnInit(): void {}
}
