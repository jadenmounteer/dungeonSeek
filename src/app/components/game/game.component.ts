import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../../src/app/components/characters/player/player.component';
import { MovementNodeComponent } from '../../src/app/components/game/movement-node/movement-node.component';
import {
  Location,
  LocationService,
  Position,
} from '../../services/location-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

export type Player = {
  name: string;
  position: Position;
  beingControlledOnClient: boolean; // False if not your turn and pass and play
  movementSpeed: number;
  currentLocation: Location | null;
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
      currentLocation: null,
      directionFacing: 'Right',
    },
  ];

  protected playerBeingControlled: Player = this.players[0];

  private playerPositionSub: Subscription;

  constructor(protected locationService: LocationService) {
    this.initializePlayerStartingNode();

    this.playerPositionSub =
      this.locationService.playerPositionSubject.subscribe(
        (location: Location) => {
          this.movePlayerToLocation(location);
        }
      );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.playerPositionSub.unsubscribe();
  }

  private initializePlayerStartingNode() {
    const location = this.locationService.locationsMap.get('Enoach Desert')!;
    this.playerBeingControlled.currentLocation = location;
    this.movePlayerToLocation(location, true);
  }

  private movePlayerToLocation(
    location: Location,
    initializing: boolean = false
  ) {
    if (!this.playerBeingControlled.currentLocation) {
      // TODO Account for the player's movement here. Somehow track how many nodes the node is from the other.
      return;
    }

    if (initializing) {
      this.changePlayerDirection(location);

      this.playerBeingControlled.position = location.position;
      return;
    }

    this.playerBeingControlled.currentLocation.adjacentLocations.forEach(
      (locationKey) => {
        if (locationKey === location.name) {
          this.changePlayerDirection(location);
          // TODO Take into account the user's movement speed on this turn
          this.playerBeingControlled.position = location.position;
          this.playerBeingControlled.currentLocation = location;
        }
      }
    );
  }

  private changePlayerDirection(location: Location) {
    if (this.playerBeingControlled.currentLocation === null) {
      return;
    }
    if (
      location.position.xPosition <
      this.playerBeingControlled.currentLocation.position.xPosition
    ) {
      this.playerBeingControlled.directionFacing = 'Left';
    } else {
      this.playerBeingControlled.directionFacing = 'Right';
    }
  }
}
