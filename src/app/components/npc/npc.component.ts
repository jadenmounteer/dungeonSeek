import { Component, InputSignal, OnInit, inject, input } from '@angular/core';
import { Npc, NpcDisplayInfo } from '../../types/npc';
import { CommonModule } from '@angular/common';
import { NpcService } from '../../services/npc.service';

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
  public npcDisplayInfo!: NpcDisplayInfo;

  private npcService: NpcService = inject(NpcService);

  public npc: InputSignal<Npc> = input.required();

  public ngOnInit(): void {
    const info = this.npcService.getCardInfo(this.npc().npcType);
    if (info) {
      this.npcDisplayInfo = info;
    } else {
      throw new Error(`${this.npc().npcType} card not found in npc deck`);
    }
  }
}
