import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Position = {
  xPosition: number;
  yPosition: number;
};

export type Location = {
  name: string;
  position: Position;
  adjacentLocations: LocationKey[];
};

export type LocationKey =
  | 'Enoach Desert'
  | 'arlan'
  | 'draebar'
  | 'The Elder Forest';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  public playerPositionSubject: Subject<Location> = new Subject<Location>();
  private enoach: Location = {
    name: 'Enoach Desert',
    position: { xPosition: 400, yPosition: 400 },
    adjacentLocations: ['arlan'],
  };

  private arlan: Location = {
    name: 'arlan',
    position: { xPosition: 600, yPosition: 550 },
    adjacentLocations: ['Enoach Desert', 'draebar', 'The Elder Forest'],
  };

  private draebar: Location = {
    name: 'draebar',
    position: { xPosition: 830, yPosition: 660 },
    adjacentLocations: ['arlan', 'The Elder Forest'],
  };

  private elderForest: Location = {
    name: 'The Elder Forest',
    position: { xPosition: 730, yPosition: 470 },
    adjacentLocations: ['The Elder Forest', 'draebar', 'arlan'],
  };

  public locationsMap: Map<LocationKey, Location> = new Map([
    ['Enoach Desert', this.enoach],
    ['arlan', this.arlan],
    ['draebar', this.draebar],
    ['The Elder Forest', this.elderForest],
  ]);

  constructor() {}

  public clickOnNode(location: Location) {
    // Move the player to the node's coordinates
    this.playerPositionSubject.next(location);
  }
}
