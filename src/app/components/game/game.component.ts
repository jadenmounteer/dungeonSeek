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
  currentNode: MovementNodeInfo | null;
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
      currentNode: null,
    },
  ];

  protected enoachDesertNodeInfo: MovementNodeInfo = {
    name: 'Enoach Desert',
    position: { xPosition: 400, yPosition: 400 },
    adjacentNodes: [],
  };

  protected arlanNodeInfo: MovementNodeInfo = {
    name: 'arlan',
    position: { xPosition: 600, yPosition: 550 },
    adjacentNodes: [],
  };

  protected draebarNodeInfo: MovementNodeInfo = {
    name: 'draebar',
    position: { xPosition: 830, yPosition: 660 },
    adjacentNodes: [],
  };

  protected elderForestNodeInfo: MovementNodeInfo = {
    name: 'The Elder Forest',
    position: { xPosition: 730, yPosition: 470 },
    adjacentNodes: [],
  };

  protected playerBeingControlled: Player = this.players[0];

  private playerPositionSub: Subscription;

  constructor(protected movementNodeService: MovementNodeService) {
    this.initializeAdjacentNodes();
    this.initializePlayerStartingNode();

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

  private initializePlayerStartingNode() {
    this.playerBeingControlled.currentNode = this.enoachDesertNodeInfo;
    this.movePlayerToNode(this.enoachDesertNodeInfo, true);
  }

  private initializeAdjacentNodes() {
    this.enoachDesertNodeInfo.adjacentNodes.push(this.arlanNodeInfo);
    this.arlanNodeInfo.adjacentNodes.push(this.enoachDesertNodeInfo);
    this.arlanNodeInfo.adjacentNodes.push(this.draebarNodeInfo);
    this.arlanNodeInfo.adjacentNodes.push(this.elderForestNodeInfo);
    this.draebarNodeInfo.adjacentNodes.push(this.arlanNodeInfo);
    this.draebarNodeInfo.adjacentNodes.push(this.elderForestNodeInfo);
    this.elderForestNodeInfo.adjacentNodes.push(this.arlanNodeInfo);
    this.elderForestNodeInfo.adjacentNodes.push(this.draebarNodeInfo);
  }

  private movePlayerToNode(
    movementNodeInfo: MovementNodeInfo,
    initializing: boolean = false
  ) {
    if (!this.playerBeingControlled.currentNode) {
      // TODO Account for the player's movement here. Somehow track how many nodes the node is from the other.
      return;
    }

    if (initializing) {
      this.playerBeingControlled.position = movementNodeInfo.position;
      return;
    }

    this.playerBeingControlled.currentNode.adjacentNodes.forEach((node) => {
      if (node.name === movementNodeInfo.name) {
        // TODO Take into account the user's movement speed on this turn
        this.playerBeingControlled.position = movementNodeInfo.position;
        this.playerBeingControlled.currentNode = movementNodeInfo;
      }
    });
  }
}
