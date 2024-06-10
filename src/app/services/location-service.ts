import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DeckName } from '../types/card-deck';

export type Position = {
  xPosition: number;
  yPosition: number;
};

export type LocationNode = {
  name: LocationKey;
  position: Position;
  adjacentLocations: LocationKey[];
  distanceFromPlayer: number | null;
  locationType: LocationType;
  eventDeckType: DeckName; // The type of deck from which you draw a card at this location when an event occurs.
};

export type LocationType =
  | 'Road'
  | 'Dungeon'
  | 'Wilderness'
  | 'Town'
  | 'City'
  | 'Forest';

export type LocationKey =
  | 'Goeth'
  | 'East Maleth Forest'
  | 'West Maleth Forest'
  | 'East Goeth Road'
  | 'Unf'
  | 'East Unf Road'
  | 'Lake View Cavern'
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
    distanceFromPlayer: null,
    locationType: 'City',
    eventDeckType: DeckName.CITY_EVENTS,
  };

  private eastGoethRoad: LocationNode = {
    name: 'East Goeth Road',
    position: { xPosition: 2838, yPosition: 2700 },
    adjacentLocations: ['Goeth', 'West Maleth Forest', 'Unf'],
    distanceFromPlayer: null,
    locationType: 'Road',
    eventDeckType: DeckName.ROAD_EVENTS,
  };

  private unf: LocationNode = {
    name: 'Unf',
    position: { xPosition: 3113, yPosition: 2608 },
    adjacentLocations: [
      'East Goeth Road',
      'East Unf Road',
      'West Maleth Forest',
      'East Maleth Forest',
    ],
    distanceFromPlayer: null,
    locationType: 'Town',
    eventDeckType: DeckName.CITY_EVENTS,
  };

  private eastUnfRoad: LocationNode = {
    name: 'East Unf Road',
    position: { xPosition: 3436, yPosition: 2585 },
    adjacentLocations: ['Unf', 'West Hillmire Road', 'Lake View Cavern'],
    distanceFromPlayer: null,
    locationType: 'Road',
    eventDeckType: DeckName.ROAD_EVENTS,
  };

  private westMalethForest: LocationNode = {
    name: 'West Maleth Forest',
    position: { xPosition: 2989, yPosition: 2868 },
    adjacentLocations: ['Goeth', 'East Unf Road', 'Unf', 'East Maleth Forest'],
    distanceFromPlayer: null,
    locationType: 'Forest',
    eventDeckType: DeckName.FOREST_EVENTS,
  };

  private eastMalethForest: LocationNode = {
    name: 'East Maleth Forest',
    position: { xPosition: 3313, yPosition: 2815 },
    adjacentLocations: ['West Maleth Forest', 'Unf', 'Lake View Cavern'],
    distanceFromPlayer: null,
    locationType: 'Forest',
    eventDeckType: DeckName.FOREST_EVENTS,
  };

  private lakeViewCavern: LocationNode = {
    name: 'Lake View Cavern',
    position: { xPosition: 3574, yPosition: 2694 },
    adjacentLocations: ['East Unf Road'],
    distanceFromPlayer: null,
    locationType: 'Dungeon',
    eventDeckType: DeckName.ROAD_EVENTS, // TODO change this to a dungeon deck. Architect how to do this. // You can enter the dungeon but there are also wilderness cards and events that happen while outside of a dungeon.
  };

  private westHillmireRoad: LocationNode = {
    name: 'West Hillmire Road',
    position: { xPosition: 3467, yPosition: 2326 },
    adjacentLocations: ['East Unf Road', 'Hillmire'],
    distanceFromPlayer: null,
    locationType: 'Road',
    eventDeckType: DeckName.ROAD_EVENTS,
  };

  private hillmire: LocationNode = {
    name: 'Hillmire',
    position: { xPosition: 3677, yPosition: 2180 },
    adjacentLocations: ['Hillmire North Road', 'West Hillmire Road'],
    distanceFromPlayer: null,
    locationType: 'Town',
    eventDeckType: DeckName.CITY_EVENTS,
  };

  private hillmireNorthRoad: LocationNode = {
    name: 'Hillmire North Road',
    position: { xPosition: 3602, yPosition: 1939 },
    adjacentLocations: ['Hillmire', 'Dunal East Road'],
    distanceFromPlayer: null,
    locationType: 'Road',
    eventDeckType: DeckName.ROAD_EVENTS,
  };

  private dunalEastRoad: LocationNode = {
    name: 'Dunal East Road',
    position: { xPosition: 3500, yPosition: 1742 },
    adjacentLocations: ['Hillmire North Road', 'Dunal'],
    distanceFromPlayer: null,
    locationType: 'Road',
    eventDeckType: DeckName.ROAD_EVENTS,
  };

  private dunal: LocationNode = {
    name: 'Dunal',
    position: { xPosition: 3120, yPosition: 1807 },
    adjacentLocations: ['Dunal East Road', 'Dunal West Road'],
    distanceFromPlayer: null,
    locationType: 'Town',
    eventDeckType: DeckName.CITY_EVENTS,
  };

  private dunalWestRoad: LocationNode = {
    name: 'Dunal West Road',
    position: { xPosition: 2901, yPosition: 1765 },
    adjacentLocations: ['Dunal', 'Mullin Forest'],
    distanceFromPlayer: null,
    locationType: 'Road',
    eventDeckType: DeckName.ROAD_EVENTS,
  };

  private mullinForest: LocationNode = {
    name: 'Mullin Forest',
    position: { xPosition: 2600, yPosition: 1809 },
    adjacentLocations: ['Dunal West Road', 'Mullin', 'Bayrom'],
    distanceFromPlayer: null,
    locationType: 'Road',
    eventDeckType: DeckName.ROAD_EVENTS,
  };

  private mullin: LocationNode = {
    name: 'Mullin',
    position: { xPosition: 2185, yPosition: 1822 },
    adjacentLocations: ['Mullin Forest', 'Bayrom'],
    distanceFromPlayer: null,
    locationType: 'Town',
    eventDeckType: DeckName.CITY_EVENTS,
  };

  private bayrom: LocationNode = {
    name: 'Bayrom',
    position: { xPosition: 2413, yPosition: 2034 },
    adjacentLocations: ['Mullin Forest', 'Mullin'],
    distanceFromPlayer: null,
    locationType: 'Town',
    eventDeckType: DeckName.CITY_EVENTS,
  };

  public locationsMap: Map<LocationKey, LocationNode> = new Map([
    ['Goeth', this.goeth],
    ['East Maleth Forest', this.eastMalethForest],
    ['West Maleth Forest', this.westMalethForest],
    ['East Goeth Road', this.eastGoethRoad],
    ['Unf', this.unf],
    ['East Unf Road', this.eastUnfRoad],
    ['Lake View Cavern', this.lakeViewCavern],
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

  public setDistanceFromPlayerForAdjacentLocations(
    locationsToCheck: LocationKey[],
    distanceFromCharacter: number,
    playerMovementSpeed: number,
    playerCurrentLocation: LocationNode
  ) {
    if (playerMovementSpeed < distanceFromCharacter) {
      return;
    }

    let newLocationsToCheck: LocationKey[] = [];

    locationsToCheck.forEach((adjacentLocationKey) => {
      const adjacentLocation = this.locationsMap.get(adjacentLocationKey);
      if (
        adjacentLocation &&
        adjacentLocation.distanceFromPlayer === null &&
        adjacentLocation.name != playerCurrentLocation.name
      ) {
        adjacentLocation.distanceFromPlayer = distanceFromCharacter;
        adjacentLocation.adjacentLocations.forEach((adjacentLocationKey) => {
          newLocationsToCheck.push(adjacentLocationKey);
        });
      }
    });

    distanceFromCharacter++;

    this.setDistanceFromPlayerForAdjacentLocations(
      newLocationsToCheck,
      distanceFromCharacter,
      playerMovementSpeed,
      playerCurrentLocation
    );
  }

  public resetLocationDistances() {
    this.locationsMap.forEach((location) => {
      location.distanceFromPlayer = null;
    });
  }
}
