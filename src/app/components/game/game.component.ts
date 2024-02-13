import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../../src/app/components/characters/player/player.component';
import { MovementNodeComponent } from '../../src/app/components/game/movement-node/movement-node.component';
import {
  MovementNodeService,
  Position,
} from '../../services/movement-node.service';
import { Subscription } from 'rxjs';

export type Player = {
  name: string;
  position: Position;
};
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [PlayerComponent, MovementNodeComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  protected players: Player[] = [
    {
      name: 'Player 1',
      position: { top: 0, left: 0 },
    },
  ];

  private playerPositionSub: Subscription;
  constructor(protected movementNodeService: MovementNodeService) {
    // Subscribe to the player's position
    this.playerPositionSub =
      this.movementNodeService.playerPositionSubject.subscribe((position) => {
        console.log('position', position);
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.playerPositionSub.unsubscribe();
  }
}
