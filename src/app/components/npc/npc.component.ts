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

  public inCombat = false;

  public ngOnInit(): void {
    this.inCombat = this.npc().combatSessionID !== null;
  }

  public updateHealthBar(): void {
    const npcStats = this.npc().npcStats;

    const healthPercentage =
      (npcStats.health.current / npcStats.health.total) * 100;
    const healthBar = document.getElementById('npcHealthBar');

    if (healthBar) {
      healthBar.style.width = `${healthPercentage}%`;
    }
  }

  // This is just to test the health bar
  public updateHealth() {
    this.npc().npcStats.health.current -= 1;
    this.updateHealthBar();
  }
}
