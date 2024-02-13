import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../../src/app/components/characters/player/player.component';
import { MovementNodeComponent } from '../../src/app/components/game/movement-node/movement-node.component';
import {
  MovementNodeInfo,
  MovementNodeService,
  Position,
} from '../../services/movement-node.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

export type Player = {
  name: string;
  position: Position;
  beingControlledOnClient: boolean; // False if not your turn and pass and play
  movementSpeed: number;
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
      beingControlledOnClient: true,
      movementSpeed: 4,
    },
  ];

  protected enoachDesertNodeInfo: MovementNodeInfo = {
    name: 'Enoach Desert',
    position: { xPosition: 400, yPosition: 400 },
  };

  protected arlanNodeInfo: MovementNodeInfo = {
    name: 'arlan',
    position: { xPosition: 600, yPosition: 550 },
  };

  protected playerBeingControlled: Player = this.players[0];

  private playerPositionSub: Subscription;

  constructor(protected movementNodeService: MovementNodeService) {
    // Subscribe to the player's position
    this.playerPositionSub =
      this.movementNodeService.playerPositionSubject.subscribe(
        (MovementNodeInfo: MovementNodeInfo) => {
          this.movePlayerToNode(MovementNodeInfo);
        }
      );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.playerPositionSub.unsubscribe();
  }

  private movePlayerToNode(movementNodeInfo: MovementNodeInfo) {
    // TODO Take into account the user's movement speed on this turn
    this.playerBeingControlled.position = movementNodeInfo.position;
  }
}
