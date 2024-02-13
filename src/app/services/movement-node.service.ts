import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Position = {
  top: number;
  left: number;
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
    this.playerPositionSubject.next({ top: 100, left: 100 });
  }
}
