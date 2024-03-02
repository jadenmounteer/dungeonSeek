import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerComponent } from '../characters/player/player.component';
import { MovementNodeComponent } from '../game/movement-node/movement-node.component';
import { LocationNode, LocationService } from '../../services/location-service';
import { Subscription } from 'rxjs';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameSessionService } from '../../services/game-session/game-session.service';
import { GameSession } from '../../types/game-session';
import { Character } from '../../types/character';
import { CharacterService } from '../../services/character/character.service';
import { AuthService } from '../../auth/auth.service';
import { TurnService } from '../../services/turn.service';
import { TurnArrowComponent } from '../turn-arrow/turn-arrow.component';
import { GameFooterComponent } from '../game-footer/game-footer.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    PlayerComponent,
    MovementNodeComponent,
    CommonModule,
    TurnArrowComponent,
    GameFooterComponent,
  ],
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

  protected characterBeingControlledByClient: Character | undefined;

  constructor(
    protected locationService: LocationService,
    private activatedRoute: ActivatedRoute,
    private gameSessionService: GameSessionService,
    private characterService: CharacterService,
    private authService: AuthService,
    private turnService: TurnService,
    private scroller: ViewportScroller
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
          this.moveCharacterToLocation(location);
        }
      );
  }

  private determineWhosNextToBeControlled(): void {
    this.characterBeingControlledByClient =
      this.charactersBeingControlledByClient.find((character) => {
        return this.turnService.isItMyTurnOnClientSide(
          this.gameSession,
          character.id
        );
      });
  }

  private setCharactersBeingControlledByClient(): void {
    // set this.charactersBeingControlledByClient to the characters that share the same userID as the client
    this.charactersBeingControlledByClient = this.characters.filter(
      (character) => character.userId === this.authService.activeUser?.uid
    );
  }

  private scrollToCharacterBeingControlledByClient(): void {
    if (!this.characterBeingControlledByClient) {
      return;
    }

    // Offset to center the element in the screen
    const offset = 100;
    scrollTo(
      this.characterBeingControlledByClient.currentLocation.position.xPosition -
        offset,
      this.characterBeingControlledByClient.currentLocation.position.yPosition +
        offset
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

        // TODO I probably don't need to do these things every time the characters change.
        // There probably a way to do this after the first time the characters are set.
        // I can probably use RXJS for this.
        // Or I can do something hacky and just check if the charactersBeingControlledByClient is empty.
        // If so, do this
        if (this.charactersBeingControlledByClient.length === 0) {
          this.setCharactersBeingControlledByClient();
          this.determineWhosNextToBeControlled();
          this.scrollToCharacterBeingControlledByClient();

          this.loading = false;
        }
      });
  }

  private moveCharacterToLocation(location: LocationNode) {
    // TODO Account for the player's movement here. Somehow track how many nodes the node is from the other.

    this.characterBeingControlledByClient?.currentLocation.adjacentLocations.forEach(
      (locationKey) => {
        if (locationKey === location.name) {
          if (!this.characterBeingControlledByClient) {
            throw new Error('No character being controlled by client');
          }
          this.changePlayerDirection(location);
          // TODO Take into account the user's movement speed on this turn
          this.characterBeingControlledByClient.currentLocation.position =
            location.position;

          // I use the spread operator here so we don't store the actual location in the character object.
          // If we don't do this the character object will be storing the actual location object
          // and the character will bring the location with them. :)
          this.characterBeingControlledByClient.currentLocation = {
            ...location,
          };

          // Update the character's location in the database
          this.characterService.updateCharacter(
            this.characterBeingControlledByClient,
            this.gameSession.id
          );
        }
      }
    );
  }

  // TODO implement this method
  private changePlayerDirection(location: LocationNode) {
    if (!this.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client');
    }
    if (this.characterBeingControlledByClient.currentLocation === null) {
      return;
    }
    if (
      location.position.xPosition <
      this.characterBeingControlledByClient.currentLocation.position.xPosition
    ) {
      this.characterBeingControlledByClient.directionFacing = 'Left';
    } else {
      this.characterBeingControlledByClient.directionFacing = 'Right';
    }
  }
}
