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

export type MovementInfo = {
  player: Player;
  movementNodeInfo: MovementNodeInfo;
};

@Injectable({
  providedIn: 'root',
})
export class MovementNodeService {
  public playerPositionSubject: Subject<MovementInfo> =
    new Subject<MovementInfo>();

  constructor() {}

  public clickOnNode(movementInfo: MovementInfo) {
    console.log('clickOnNode');

    // Move the player to the node's coordinates
    this.playerPositionSubject.next(movementInfo);
  }
}
