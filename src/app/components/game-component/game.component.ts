import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../characters/player/player.component';
import { MovementNodeComponent } from '../game/movement-node/movement-node.component';
import { LocationNode, LocationService } from '../../services/location-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameSessionService } from '../../services/game-session/game-session.service';
import { GameSession } from '../../types/game-session';
import { Character } from '../../types/character';
import { CharacterService } from '../../services/character/character.service';
import { AuthService } from '../../auth/auth.service';
import { TurnService } from '../../services/turn.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [PlayerComponent, MovementNodeComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  protected charactersBeingControlledByClient: Character[] = [];

  private playerPositionSub: Subscription;

  private gameSessionSub: Subscription;
  protected gameSession!: GameSession;

  protected characters: Character[] = [];
  protected charactersSub!: Subscription;
  protected loading = true;

  protected characterBeingControlledByClient: Character | null = null;

  constructor(
    protected locationService: LocationService,
    private activatedRoute: ActivatedRoute,
    private gameSessionService: GameSessionService,
    private characterService: CharacterService,
    private authService: AuthService,
    private turnService: TurnService
  ) {
    const gameSessionID = this.activatedRoute.snapshot.params['gameSessionId'];

    this.gameSessionSub = this.gameSessionService
      .getGameSession(gameSessionID)
      .subscribe((gameSession) => {
        this.gameSession = gameSession;

        // TODO I can probable do this in a cleaner way with RXJS.
        // I know there's an operator where you can subscribe to multiple observables at once.
        this.setCharactersSub();
      });

    // this.initializePlayerStartingNode();

    this.playerPositionSub =
      this.locationService.playerPositionSubject.subscribe(
        (location: LocationNode) => {
          // this.movePlayerToLocation(location);
        }
      );
  }

  private setCharactersBeingControlledByClient(): void {
    // set this.charactersBeingControlledByClient to the characters that share the same userID as the client
    this.charactersBeingControlledByClient = this.characters.filter(
      (character) => character.userId === this.authService.activeUser?.uid
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.playerPositionSub.unsubscribe();
    this.gameSessionSub.unsubscribe();
    this.charactersSub.unsubscribe();
  }

  private setCharactersSub(): void {
    this.charactersSub = this.characterService
      .getCharactersInGameSession(this.gameSession.id)
      .subscribe((characters) => {
        this.characters = characters;
        this.setCharactersBeingControlledByClient();

        this.loading = false;
      });
  }

  // TODO implement this method
  // private moveCharacterToLocation(
  //   location: Location,
  //   initializing: boolean = false
  // ) {
  //   if (!this.charactersBeingControlledByClient.currentLocation) {
  //     // TODO Account for the player's movement here. Somehow track how many nodes the node is from the other.
  //     return;
  //   }

  //   if (initializing) {
  //     this.changePlayerDirection(location);

  //     this.charactersBeingControlledByClient.position = location.position;
  //     return;
  //   }

  //   this.charactersBeingControlledByClient.currentLocation.adjacentLocations.forEach(
  //     (locationKey) => {
  //       if (locationKey === location.name) {
  //         this.changePlayerDirection(location);
  //         // TODO Take into account the user's movement speed on this turn
  //         this.charactersBeingControlledByClient.position = location.position;
  //         this.charactersBeingControlledByClient.currentLocation = location;
  //       }
  //     }
  //   );
  // }

  // TODO implement this method
  // private changePlayerDirection(location: LocationNode) {
  //   if (this.charactersBeingControlledByClient.currentLocation === null) {
  //     return;
  //   }
  //   if (
  //     location.position.xPosition <
  //     this.charactersBeingControlledByClient.currentLocation.position.xPosition
  //   ) {
  //     this.charactersBeingControlledByClient.directionFacing = 'Left';
  //   } else {
  //     this.charactersBeingControlledByClient.directionFacing = 'Right';
  //   }
  // }
}
