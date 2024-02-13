import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Position = {
  xPosition: number;
  yPosition: number;
};
@Injectable({
  providedIn: 'root',
})
export class MovementNodeService {
  public playerPositionSubject: Subject<Position> = new Subject<Position>();

  constructor() {}

  public clickOnNode() {
    console.log('clickOnNode');

    // Move the player to the node's coordinates
    this.playerPositionSubject.next({ xPosition: 100, yPosition: 100 });
  }
}
