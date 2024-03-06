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
  protected locationsLoading = true;

  protected characterBeingControlledByClient: Character | undefined;

  protected waitingForOnlinePlayersToFinishTurn = false;

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

  private updateLocationNodeDataRelativeToPlayer(): void {
    this.locationsLoading = true;
    if (!this.characterBeingControlledByClient) {
      throw Error('No character being controlled by client');
    }

    let playersMovementSpeedValue =
      this.characterBeingControlledByClient.movementSpeed;

    let distanceFromCharacter = 1;
    let locationToCheck: LocationNode =
      this.characterBeingControlledByClient.currentLocation;

    this.locationService.setDistanceFromPlayerForAdjacentLocations(
      locationToCheck.adjacentLocations,
      distanceFromCharacter,
      playersMovementSpeedValue,
      this.characterBeingControlledByClient.currentLocation
    );

    this.locationsLoading = false;
  }

  private determineWhosNextToBeControlledByClient(): void {
    this.charactersBeingControlledByClient.forEach((character) => {
      if (
        this.turnService.isItMyTurnOnClientSide(this.gameSession, character.id)
      ) {
        this.characterBeingControlledByClient = character;
      }
    });
  }

  private setCharactersBeingControlledByClient(): void {
    // TODO This might be where the movement speed issue is
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
    const xOffset = -100;
    const yOffset = -300;
    scrollTo(
      this.characterBeingControlledByClient.currentLocation.position.xPosition +
        xOffset,
      this.characterBeingControlledByClient.currentLocation.position.yPosition +
        yOffset
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
          console.log('in if statement');
          this.onEnterGameSession();

          this.loading = false;
        }
      });
  }

  private moveCharacterToLocation(location: LocationNode) {
    if (!this.characterBeingControlledByClient) {
      return;
    }

    if (this.characterBeingControlledByClient.movementSpeed === 0) {
      return;
    }

    // If the location is not within reach, don't move the character
    if (location.distanceFromPlayer === null) {
      return;
    }

    if (
      location.distanceFromPlayer >
      this.characterBeingControlledByClient.movementSpeed
    ) {
      return;
    }

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

    this.characterBeingControlledByClient.movementSpeed -=
      location.distanceFromPlayer ?? 1;

    // Update the character's location in the database
    this.characterService.updateCharacter(
      this.characterBeingControlledByClient,
      this.gameSession.id
    );

    this.locationService.resetLocationDistances();
    this.updateLocationNodeDataRelativeToPlayer();
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

  protected currentCharacterFinishedTurn(): void {
    if (!this.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client');
    }

    this.turnService.endCharacterTurn(
      this.gameSession,
      this.characterBeingControlledByClient.id
    );

    this.initializeNewCharacterTurn();
  }

  // Called when a character navigates back to the game session
  private onEnterGameSession() {
    this.setCharactersBeingControlledByClient();
    this.determineWhosNextToBeControlledByClient();
    console.log(this.characterBeingControlledByClient);

    if (this.characterBeingControlledByClient) {
      this.scrollToCharacterBeingControlledByClient();
      this.updateLocationNodeDataRelativeToPlayer();
    }
  }

  private async initializeNewCharacterTurn() {
    console.log('Initializing new character turn!');
    this.setCharactersBeingControlledByClient();
    this.determineWhosNextToBeControlledByClient();
    if (this.characterBeingControlledByClient) {
      this.scrollToCharacterBeingControlledByClient();
      this.updateLocationNodeDataRelativeToPlayer();
    } else {
      if (
        !this.gameSession.currentTurn.playerIDsWhoHaveFinishedTurn.includes(
          this.authService.activeUser!.uid
        )
      ) {
        console.log(
          `Signalling to server that ${this.authService.activeUser?.email} is done moving all their characters this turn`
        );
        await this.turnService.signalToServerThatPlayerIsDone(
          this.authService.activeUser!.uid,
          this.gameSession
        );
      }

      // This logic should ensure the last player to finish their turn is the one who starts the next turn
      if (this.turnService.allPlayersHaveFinishedTheirTurn(this.gameSession)) {
        console.log('All players have finished their turns');
        this.waitingForOnlinePlayersToFinishTurn = false;
        // then start the next turn

        await this.turnService.createNewTurn(
          this.gameSession,
          this.characters.map((character) => character.id)
        );

        console.log('Created new turn');

        console.log(this.gameSession);

        console.log('Before', this.charactersBeingControlledByClient);
        // TODO this logic needs to trigger every time a new turn is created
        await this.turnService.resetCharacterMovementSpeeds(
          this.charactersBeingControlledByClient,
          this.gameSession.id
        );

        console.log('After', this.charactersBeingControlledByClient);

        this.initializeNewCharacterTurn();
      } else {
        this.waitingForOnlinePlayersToFinishTurn = true;
      }
    }
  }
}
