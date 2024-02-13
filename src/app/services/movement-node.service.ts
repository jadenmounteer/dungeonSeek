import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '../components/game/game.component';

export type Position = {
  xPosition: number;
  yPosition: number;
};

export type MovementNodeInfo = {
  name: string;
  position: Position;
};

@Injectable({
  providedIn: 'root',
})
export class MovementNodeService {
  public playerPositionSubject: Subject<MovementNodeInfo> =
    new Subject<MovementNodeInfo>();

  constructor() {}

  public clickOnNode(MovementNodeInfo: MovementNodeInfo) {
    console.log('clickOnNode');

    // Move the player to the node's coordinates
    this.playerPositionSubject.next(MovementNodeInfo);
  }
}
