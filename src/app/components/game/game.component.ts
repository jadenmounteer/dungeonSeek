import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../../src/app/components/characters/player/player.component';
import { MovementNodeComponent } from '../../src/app/components/game/movement-node/movement-node.component';
import {
  MovementNodeService,
  Position,
} from '../../services/movement-node.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

export type Player = {
  name: string;
  position: Position;
};
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [PlayerComponent, MovementNodeComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  protected players: Player[] = [
    {
      name: 'Player 1',
      position: { xPosition: 0, yPosition: 0 },
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
