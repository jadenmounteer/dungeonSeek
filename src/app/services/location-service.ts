import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Position = {
  xPosition: number;
  yPosition: number;
};

export type LocationNode = {
  name: string;
  position: Position;
  adjacentLocations: LocationKey[];
};

export type LocationKey =
  | 'Goeth'
  | 'arlan'
  | 'draebar'
  | 'The Elder Forest'
  | 'draebar cave';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  public playerPositionSubject: Subject<LocationNode> =
    new Subject<LocationNode>();
  private goeth: LocationNode = {
    name: 'Goeth',
    position: { xPosition: 2500, yPosition: 1300 },
    adjacentLocations: ['arlan'],
  };

  private arlan: LocationNode = {
    name: 'arlan',
    position: { xPosition: 2600, yPosition: 1160 },
    adjacentLocations: ['Goeth', 'draebar', 'The Elder Forest'],
  };

  private draebar: LocationNode = {
    name: 'draebar',
    position: { xPosition: 2820, yPosition: 1100 },
    adjacentLocations: ['arlan', 'The Elder Forest', 'draebar cave'],
  };

  private elderForest: LocationNode = {
    name: 'The Elder Forest',
    position: { xPosition: 2600, yPosition: 980 },
    adjacentLocations: ['The Elder Forest', 'draebar', 'arlan'],
  };

  private draebarCave: LocationNode = {
    name: 'draebar cave',
    position: { xPosition: 2900, yPosition: 1150 },
    adjacentLocations: ['draebar'],
  };

  public locationsMap: Map<LocationKey, LocationNode> = new Map([
    ['Goeth', this.goeth],
    ['arlan', this.arlan],
    ['draebar', this.draebar],
    ['The Elder Forest', this.elderForest],
    ['draebar cave', this.draebarCave],
  ]);

  constructor() {}

  public clickOnNode(location: LocationNode) {
    // Move the player to the node's coordinates
    this.playerPositionSubject.next(location);
  }
}
