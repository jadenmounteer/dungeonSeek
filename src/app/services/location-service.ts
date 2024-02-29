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
  | 'East Goeth Road'
  | 'Unf'
  | 'East Unf Road'
  | 'West Hillmire Road'
  | 'Hillmire';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  public playerPositionSubject: Subject<LocationNode> =
    new Subject<LocationNode>();
  private goeth: LocationNode = {
    name: 'Goeth',
    position: { xPosition: 2500, yPosition: 1300 },
    adjacentLocations: ['East Goeth Road'],
  };

  private eastGoethRoad: LocationNode = {
    name: 'East Goeth Road',
    position: { xPosition: 2850, yPosition: 1200 },
    adjacentLocations: ['Goeth', 'Unf'],
  };

  private unf: LocationNode = {
    name: 'Unf',
    position: { xPosition: 3110, yPosition: 1120 },
    adjacentLocations: ['East Goeth Road', 'East Unf Road'],
  };

  private eastUnfRoad: LocationNode = {
    name: 'East Unf Road',
    position: { xPosition: 3420, yPosition: 1110 },
    adjacentLocations: ['Unf', 'West Hillmire Road'],
  };

  private westHillmireRoad: LocationNode = {
    name: 'West Hillmire Road',
    position: { xPosition: 3460, yPosition: 850 },
    adjacentLocations: ['East Unf Road', 'Hillmire'],
  };

  private hillmire: LocationNode = {
    name: 'Hillmire',
    position: { xPosition: 3680, yPosition: 700 },
    adjacentLocations: ['East Unf Road', 'West Hillmire Road'],
  };

  public locationsMap: Map<LocationKey, LocationNode> = new Map([
    ['Goeth', this.goeth],
    ['East Goeth Road', this.eastGoethRoad],
    ['Unf', this.unf],
    ['East Unf Road', this.eastUnfRoad],
    ['West Hillmire Road', this.westHillmireRoad],
    ['Hillmire', this.hillmire],
  ]);

  constructor() {}

  public clickOnNode(location: LocationNode) {
    // Move the player to the node's coordinates
    this.playerPositionSubject.next(location);
  }
}
