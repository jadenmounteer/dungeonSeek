import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Position = {
  xPosition: number;
  yPosition: number;
};

export type Location = {
  name: string;
  position: Position;
  adjacentLocations: Location[];
};

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  public playerPositionSubject: Subject<Location> = new Subject<Location>();

  constructor() {}

  public clickOnNode(location: Location) {
    // Move the player to the node's coordinates
    this.playerPositionSubject.next(location);
  }
}
