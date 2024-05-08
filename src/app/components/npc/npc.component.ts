import { Component, InputSignal, input } from '@angular/core';
import { Npc } from '../../types/npc';

/**
 * This component is responsible for rendering an NPC and handling its interactions with the world.
 */
@Component({
  selector: 'app-npc',
  standalone: true,
  imports: [],
  templateUrl: './npc.component.html',
  styleUrl: './npc.component.scss',
})
export class NpcComponent {
  public npc: InputSignal<Npc> = input.required();
}
