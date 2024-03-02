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
  | 'Hillmire'
  | 'Hillmire North Road'
  | 'Dunal East Road'
  | 'Dunal'
  | 'Dunal West Road'
  | 'Mullin Forest'
  | 'Mullin'
  | 'Bayrom';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  public playerPositionSubject: Subject<LocationNode> =
    new Subject<LocationNode>();
  private goeth: LocationNode = {
    name: 'Goeth',
    position: { xPosition: 2489, yPosition: 2803 },
    adjacentLocations: ['East Goeth Road'],
  };

  private eastGoethRoad: LocationNode = {
    name: 'East Goeth Road',
    position: { xPosition: 2838, yPosition: 2700 },
    adjacentLocations: ['Goeth', 'Unf'],
  };

  private unf: LocationNode = {
    name: 'Unf',
    position: { xPosition: 3113, yPosition: 2608 },
    adjacentLocations: ['East Goeth Road', 'East Unf Road'],
  };

  private eastUnfRoad: LocationNode = {
    name: 'East Unf Road',
    position: { xPosition: 3436, yPosition: 2585 },
    adjacentLocations: ['Unf', 'West Hillmire Road'],
  };

  private westHillmireRoad: LocationNode = {
    name: 'West Hillmire Road',
    position: { xPosition: 3467, yPosition: 2326 },
    adjacentLocations: ['East Unf Road', 'Hillmire'],
  };

  private hillmire: LocationNode = {
    name: 'Hillmire',
    position: { xPosition: 3677, yPosition: 2180 },
    adjacentLocations: ['Hillmire North Road', 'West Hillmire Road'],
  };

  private hillmireNorthRoad: LocationNode = {
    name: 'Hillmire North Road',
    position: { xPosition: 3602, yPosition: 1939 },
    adjacentLocations: ['Hillmire', 'Dunal East Road'],
  };

  private dunalEastRoad: LocationNode = {
    name: 'Dunal East Road',
    position: { xPosition: 3500, yPosition: 1742 },
    adjacentLocations: ['Hillmire North Road', 'Dunal'],
  };

  private dunal: LocationNode = {
    name: 'Dunal',
    position: { xPosition: 3120, yPosition: 1807 },
    adjacentLocations: ['Dunal East Road', 'Dunal West Road'],
  };

  private dunalWestRoad: LocationNode = {
    name: 'Dunal West Road',
    position: { xPosition: 2901, yPosition: 1765 },
    adjacentLocations: ['Dunal', 'Mullin Forest'],
  };

  private mullinForest: LocationNode = {
    name: 'Mullin Forest',
    position: { xPosition: 2600, yPosition: 1809 },
    adjacentLocations: ['Dunal West Road', 'Mullin', 'Bayrom'],
  };

  private mullin: LocationNode = {
    name: 'Mullin',
    position: { xPosition: 2185, yPosition: 1822 },
    adjacentLocations: ['Mullin Forest', 'Bayrom'],
  };

  private bayrom: LocationNode = {
    name: 'Bayrom',
    position: { xPosition: 2413, yPosition: 2034 },
    adjacentLocations: ['Mullin Forest', 'Mullin'],
  };

  public locationsMap: Map<LocationKey, LocationNode> = new Map([
    ['Goeth', this.goeth],
    ['East Goeth Road', this.eastGoethRoad],
    ['Unf', this.unf],
    ['East Unf Road', this.eastUnfRoad],
    ['West Hillmire Road', this.westHillmireRoad],
    ['Hillmire', this.hillmire],
    ['Hillmire North Road', this.hillmireNorthRoad],
    ['Dunal East Road', this.dunalEastRoad],
    ['Dunal', this.dunal],
    ['Dunal West Road', this.dunalWestRoad],
    ['Mullin Forest', this.mullinForest],
    ['Mullin', this.mullin],
    ['Bayrom', this.bayrom],
  ]);

  constructor() {}

  public clickOnNode(location: LocationNode) {
    // Move the player to the node's coordinates
    this.playerPositionSubject.next(location);
  }
}
