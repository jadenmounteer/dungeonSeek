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
import { GameFooterComponent } from '../game-footer-legacy/game-footer.component';
import { LocationInfoComponent } from '../location-info/location-info.component';
import { CardDeck, DeckName, Outcome } from '../../types/card-deck';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogueComponent } from '../confirmation-dialogue/confirmation-dialogue.component';
import type { ConfirmationDialogData } from '../confirmation-dialogue/confirmation-dialogue.component';
import {
  DiceRollDialogComponent,
  DiceRollDialogData,
} from '../dice-roll-dialog/dice-roll-dialog.component';
import { CharacterInfoComponent } from '../character-info/character-info.component';
import { EventMenuComponent } from '../event-menu/event-menu.component';
import { ItemMenuComponent } from '../item-menu/item-menu.component';
import { EventCardService } from '../../services/event-card.service';
import { RoadEventCardNames } from '../../types/event-card';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    PlayerComponent,
    MovementNodeComponent,
    CommonModule,
    TurnArrowComponent,
    GameFooterComponent,
    LocationInfoComponent,
    EventMenuComponent,
    CharacterInfoComponent,
    DiceRollDialogComponent,
    ItemMenuComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  protected diceRollingData: DiceRollDialogData | undefined;

  protected charactersBeingControlledByClient: Character[] = [];

  private playerPositionSub: Subscription;

  private gameSessionSub: Subscription;
  protected gameSession!: GameSession;

  protected allCharactersCurrentlyInGameSession: Character[] = [];
  protected charactersSub!: Subscription;
  protected loading = true;
  protected locationsLoading = true;
  protected currentCharacterRolledForEventCardThisTurn = false;
  protected currentCharacterRollingDice = false;

  protected characterBeingControlledByClient: Character | undefined;

  protected waitingForNextTurnToStart = false;
  protected showEventCard = false;
  protected cardName: string | undefined;
  protected deckName: DeckName | undefined;

  constructor(
    protected locationService: LocationService,
    private activatedRoute: ActivatedRoute,
    private gameSessionService: GameSessionService,
    private characterService: CharacterService,
    private authService: AuthService,
    private turnService: TurnService,
    public dialog: MatDialog,
    private eventCardService: EventCardService
  ) {
    const gameSessionID = this.activatedRoute.snapshot.params['gameSessionId'];

    this.gameSessionSub = this.gameSessionService
      .getGameSession(gameSessionID)
      .subscribe((gameSession) => {
        this.gameSession = gameSession;

        this.eventCardService.setCardDeckSubscriptions(this.gameSession.id);

        // If people were waiting for an online player to finish their turn
        // and they just finished their turn, start the next turn
        // We also check the characterIDsWhoHaveTakenTurn array because this gameSession subscription will
        // fire multiple times while we are waiting for other players
        if (
          this.waitingForNextTurnToStart &&
          this.gameSession.currentTurn.characterIDsWhoHaveTakenTurn.length === 0
        ) {
          this.waitingForNextTurnToStart = false;

          this.startNewCharacterTurn();
        }

        // TODO I can probable do this in a cleaner way with RXJS.
        // I know there's an operator where you can subscribe to multiple observables at once.
        if (!this.charactersSub) {
          this.setCharactersSub();
        }
      });

    this.playerPositionSub =
      this.locationService.playerPositionSubject.subscribe(
        (location: LocationNode) => {
          this.moveCharacterToLocation(location);
        }
      );
  }

  private updateLocationNodeDataRelativeToPlayer(): void {
    this.locationService.resetLocationDistances();

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
    // set this.charactersBeingControlledByClient to the characters that share the same userID as the client
    this.charactersBeingControlledByClient =
      this.allCharactersCurrentlyInGameSession.filter((character) => {
        return character.userId === this.authService.activeUser?.uid;
      });
  }

  ngOnInit(): void {}

  async ngOnDestroy(): Promise<void> {
    this.playerPositionSub.unsubscribe();
    this.gameSessionSub.unsubscribe();
    this.charactersSub.unsubscribe();

    // If there are multiple players, signal to the server that the player is done with their turn
    if (this.gameSession.playerIDs.length > 1) {
      await this.currentCharacterFinishedTurn();
    }

    // Remove all of the player's characters from the game session for now
    // so the other players can take turns without needing to wait.
    await this.gameSessionService.temporarilyRemovePlayersAndCharactersFromGameSession(
      this.gameSession,
      this.charactersBeingControlledByClient
    );
  }

  private setCharactersSub(): void {
    this.charactersSub = this.characterService
      .getCharactersInGameSession(this.gameSession.id)
      .subscribe((allCharactersInGameLobby) => {
        this.allCharactersCurrentlyInGameSession =
          this.gameSessionService.getCharactersInCurrentGameSession(
            allCharactersInGameLobby,
            this.gameSession
          );

        // TODO I probably don't need to do these things every time the characters change.
        // There probably a way to do this after the first time the characters are set.
        // I can probably use RXJS for this.
        // Or I can do something hacky and just check if the charactersBeingControlledByClient is empty.
        // If so, do this
        if (this.charactersBeingControlledByClient.length === 0) {
          this.enterGameSession();
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

    this.updateLocationNodeDataRelativeToPlayer();
    this.gameSessionService.scrollToCharacterBeingControlledByClient(
      this.characterBeingControlledByClient
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

  protected async currentCharacterFinishedTurn(): Promise<void> {
    this.currentCharacterRolledForEventCardThisTurn = false;

    if (!this.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client');
    }

    await this.turnService.endCharacterTurn(
      this.gameSession,
      this.characterBeingControlledByClient.id
    );

    // If all the characters on client side have finished their turn, add the playerID to the array
    let playerIsFinished = true;
    this.charactersBeingControlledByClient.forEach((character) => {
      if (
        !this.gameSession.currentTurn.characterIDsWhoHaveTakenTurn.includes(
          character.id
        )
      ) {
        playerIsFinished = false;
      }
    });

    if (playerIsFinished) {
      this.characterBeingControlledByClient = undefined;
      await this.turnService.signalToServerThatPlayerIsDone(
        this.authService.activeUser!.uid,
        this.gameSession
      );

      if (this.turnService.allPlayersHaveFinishedTheirTurn(this.gameSession)) {
        this.waitingForNextTurnToStart = true;

        await this.turnService.createNewTurn(
          this.gameSession,
          this.allCharactersCurrentlyInGameSession.map(
            (character) => character.id
          )
        );
      } else {
        this.waitingForNextTurnToStart = true;
      }
    } else {
      this.startNewCharacterTurn();
    }
  }

  private async enterGameSession() {
    await this.gameSessionService.addPlayersAndCharactersToGameSession(
      this.allCharactersCurrentlyInGameSession,
      this.gameSession
    );

    this.setCharactersBeingControlledByClient();

    // Since they just came back to the game session, clear their id from the array of characterIDsWhoHaveTakenTurn
    // So they can go again
    await this.turnService.clearClientCharacterIDsFromTurnArray(
      this.gameSession,
      this.characterService.getClientCharacters(
        this.allCharactersCurrentlyInGameSession,
        this.authService.activeUser?.uid
      )
    );

    await this.turnService.resetCharacterMovementSpeeds(
      this.charactersBeingControlledByClient,
      this.gameSession.id
    );

    this.determineWhosNextToBeControlledByClient();

    if (this.characterBeingControlledByClient) {
      this.gameSessionService.scrollToCharacterBeingControlledByClient(
        this.characterBeingControlledByClient
      );
      this.updateLocationNodeDataRelativeToPlayer();
    }
  }

  private async startNewCharacterTurn() {
    // TODO I only need to reset the movement speed of the next player, not all of them.
    await this.turnService.resetCharacterMovementSpeeds(
      this.charactersBeingControlledByClient,
      this.gameSession.id
    );

    this.determineWhosNextToBeControlledByClient();

    if (this.characterBeingControlledByClient) {
      this.gameSessionService.scrollToCharacterBeingControlledByClient(
        this.characterBeingControlledByClient
      );
      this.updateLocationNodeDataRelativeToPlayer();
    }
  }

  protected async drawEventCard(): Promise<void> {
    if (!this.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw an event card without a character."
      );
    }
    this.cardName = await this.eventCardService.drawEventCard(
      this.characterBeingControlledByClient.currentLocation.locationType,
      this.gameSession.id
    );

    this.deckName =
      this.characterBeingControlledByClient?.currentLocation.eventDeckType;

    this.showEventCard = true;
  }

  protected closeCard() {
    this.showEventCard = false;
  }
  protected makeChoice(outcome: Outcome) {
    this.showEventCard = false;
  }

  protected endMovement() {
    if (this.characterBeingControlledByClient!.movementSpeed ?? 0 > 0) {
      // TODO Show a confirmation dialog telling the user they won't be able to move anymore if they roll for an event card.
      const data: ConfirmationDialogData = {
        title: undefined,
        message: `You can still move ${
          this.characterBeingControlledByClient!.movementSpeed
        } spaces. Are you sure you want to stop moving?`,
      };
      const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
        data,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.characterBeingControlledByClient!.movementSpeed = 0;

          this.rollForEventCard();
        } else {
          this.gameSessionService.scrollToCharacterBeingControlledByClient(
            this.characterBeingControlledByClient
          );
        }
      });
    } else {
      this.rollForEventCard();
    }
  }

  /**
   * Before ending their turn, a character must roll for an event card.
   * They have a 1 in 4 chance of drawing an event card.
   */
  protected rollForEventCard() {
    this.diceRollingData = {
      title: 'Roll for Event Card',
      message: 'If you roll a 3 or less, draw an event card.',
      closeButtonName: 'Draw Event Card',
      numberOfDice: 1,
      comparator: '<=',
      targetNumber: 3,
    };
    this.currentCharacterRollingDice = true;
  }
}
