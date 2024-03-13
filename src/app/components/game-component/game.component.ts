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
import { LocationInfoComponent } from '../location-info/location-info.component';
import { GameCardComponent } from '../game-card/game-card.component';
import { CardService } from '../../services/card.service';
import { CardInfo, DeckName } from '../../types/card-deck';

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
    GameCardComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  protected charactersBeingControlledByClient: Character[] = [];

  private playerPositionSub: Subscription;
  private cardsSub: Subscription | undefined;

  private gameSessionSub: Subscription;
  protected gameSession!: GameSession;

  protected allCharactersCurrentlyInGameSession: Character[] = [];
  protected charactersSub!: Subscription;
  protected loading = true;
  protected locationsLoading = true;

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
    private cardService: CardService
  ) {
    const gameSessionID = this.activatedRoute.snapshot.params['gameSessionId'];

    this.gameSessionSub = this.gameSessionService
      .getGameSession(gameSessionID)
      .subscribe((gameSession) => {
        console.log(gameSession);
        this.gameSession = gameSession;

        this.updateCards();

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

    // this.initializePlayerStartingNode();

    this.playerPositionSub =
      this.locationService.playerPositionSubject.subscribe(
        (location: LocationNode) => {
          this.moveCharacterToLocation(location);
        }
      );
  }

  private updateCards() {
    if (!this.cardsSub) {
      this.cardsSub = this.cardService
        .fetchCardDecks(this.gameSession.id)
        .subscribe((cardDecks) => {
          this.cardService.cardDecks = cardDecks;
        });
    }
  }

  private updateLocationNodeDataRelativeToPlayer(): void {
    this.locationService.resetLocationDistances();

    this.locationsLoading = true;
    if (!this.characterBeingControlledByClient) {
      throw Error('No character being controlled by client');
    }

    let playersMovementSpeedValue =
      this.characterBeingControlledByClient.movementSpeed;

    console.log(
      `Updating location nodes relative to ${this.characterBeingControlledByClient.name}`
    );
    console.log(
      `${this.characterBeingControlledByClient.name}'s movement speed:`,
      playersMovementSpeedValue
    );

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
    if (this.cardsSub) {
      this.cardsSub.unsubscribe();
    }

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
        console.log(
          'Looks like all players have finished their turns. Starting a new one.'
        );
        this.waitingForNextTurnToStart = true;

        await this.turnService.createNewTurn(
          this.gameSession,
          this.allCharactersCurrentlyInGameSession.map(
            (character) => character.id
          )
        );
        console.log('New turn started...');
      } else {
        console.log(
          'Ok...we finished our turn and are waiting for the next player to start'
        );
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
    console.log('Starting new character turn');
    console.log(this.gameSession);
    // TODO I only need to reset the movement speed of the next player, not all of them.
    await this.turnService.resetCharacterMovementSpeeds(
      this.charactersBeingControlledByClient,
      this.gameSession.id
    );

    this.determineWhosNextToBeControlledByClient();

    if (this.characterBeingControlledByClient) {
      console.log(`Scrolling to ${this.characterBeingControlledByClient.name}`);
      this.gameSessionService.scrollToCharacterBeingControlledByClient(
        this.characterBeingControlledByClient
      );
      this.updateLocationNodeDataRelativeToPlayer();
    }
  }

  protected drawEventCard() {
    if (
      this.characterBeingControlledByClient?.currentLocation.locationType ===
      'Road'
    ) {
      this.cardName = 'Crazy Traveler';
      this.deckName = DeckName.ROAD_EVENTS;
    }

    this.showEventCard = true;
  }

  protected closeCard(event: CardInfo) {
    this.showEventCard = false;
    this.gameSessionService.updateGameSession(this.gameSession);
  }
}
