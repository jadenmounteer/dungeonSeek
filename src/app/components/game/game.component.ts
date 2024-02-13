import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../../src/app/components/characters/player/player.component';
import { MovementNodeComponent } from '../../src/app/components/game/movement-node/movement-node.component';
import { MovementNodeService } from '../../services/movement-node.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [PlayerComponent, MovementNodeComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  private playerPositionSub: Subscription;
  constructor(protected movementNodeService: MovementNodeService) {
    // Subscribe to the player's position
    this.playerPositionSub =
      this.movementNodeService.playerPositionSubject.subscribe((position) => {
        console.log('position', position);
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.playerPositionSub.unsubscribe();
  }
}
