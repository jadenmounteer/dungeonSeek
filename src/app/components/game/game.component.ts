import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../../src/app/components/characters/player/player.component';
import { MovementNodeComponent } from '../../src/app/components/game/movement-node/movement-node.component';
import {
  Location,
  MovementNodeService,
  Position,
} from '../../services/location-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

export type Player = {
  name: string;
  position: Position;
  beingControlledOnClient: boolean; // False if not your turn and pass and play
  movementSpeed: number;
  currentNode: Location | null;
  directionFacing: 'Right' | 'Left';
};
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [PlayerComponent, MovementNodeComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  // TODO rather than having a position, the player should have a location property that is a reference to the node they are on
  protected players: Player[] = [
    {
      name: 'Player 1',
      position: { xPosition: 0, yPosition: 0 },
      beingControlledOnClient: true,
      movementSpeed: 4,
      currentNode: null,
      directionFacing: 'Right',
    },
  ];

  protected enoachDesertNodeInfo: Location = {
    name: 'Enoach Desert',
    position: { xPosition: 400, yPosition: 400 },
    adjacentLocations: [],
  };

  protected arlanNodeInfo: Location = {
    name: 'arlan',
    position: { xPosition: 600, yPosition: 550 },
    adjacentLocations: [],
  };

  protected draebarNodeInfo: Location = {
    name: 'draebar',
    position: { xPosition: 830, yPosition: 660 },
    adjacentLocations: [],
  };

  protected elderForestNodeInfo: Location = {
    name: 'The Elder Forest',
    position: { xPosition: 730, yPosition: 470 },
    adjacentLocations: [],
  };

  protected playerBeingControlled: Player = this.players[0];

  private playerPositionSub: Subscription;

  constructor(protected movementNodeService: MovementNodeService) {
    this.initializeadjacentLocations();
    this.initializePlayerStartingNode();

    this.playerPositionSub =
      this.movementNodeService.playerPositionSubject.subscribe(
        (location: Location) => {
          this.movePlayerToNode(location);
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

  private initializeadjacentLocations() {
    this.enoachDesertNodeInfo.adjacentLocations.push(this.arlanNodeInfo);
    this.arlanNodeInfo.adjacentLocations.push(this.enoachDesertNodeInfo);
    this.arlanNodeInfo.adjacentLocations.push(this.draebarNodeInfo);
    this.arlanNodeInfo.adjacentLocations.push(this.elderForestNodeInfo);
    this.draebarNodeInfo.adjacentLocations.push(this.arlanNodeInfo);
    this.draebarNodeInfo.adjacentLocations.push(this.elderForestNodeInfo);
    this.elderForestNodeInfo.adjacentLocations.push(this.arlanNodeInfo);
    this.elderForestNodeInfo.adjacentLocations.push(this.draebarNodeInfo);
  }

  private movePlayerToNode(location: Location, initializing: boolean = false) {
    if (!this.playerBeingControlled.currentNode) {
      // TODO Account for the player's movement here. Somehow track how many nodes the node is from the other.
      return;
    }

    if (initializing) {
      this.changePlayerDirection(location);

      this.playerBeingControlled.position = location.position;
      return;
    }

    this.playerBeingControlled.currentNode.adjacentLocations.forEach((node) => {
      if (node.name === location.name) {
        this.changePlayerDirection(location);
        // TODO Take into account the user's movement speed on this turn
        this.playerBeingControlled.position = location.position;
        this.playerBeingControlled.currentNode = location;
      }
    });
  }

  private changePlayerDirection(location: Location) {
    if (
      location.position.xPosition <
      this.playerBeingControlled.position.xPosition
    ) {
      this.playerBeingControlled.directionFacing = 'Left';
    } else {
      this.playerBeingControlled.directionFacing = 'Right';
    }
  }
}
