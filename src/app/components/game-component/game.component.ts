import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { PlayerComponent } from '../characters/player/player.component';
import { MovementNodeComponent } from '../game/movement-node/movement-node.component';
import { LocationNode, LocationService } from '../../services/location-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameSessionService } from '../../services/game-session/game-session.service';
import { GameSession } from '../../types/game-session';
import { Character, CharacterMenuEquipment } from '../../types/character';
import { CharacterService } from '../../services/character/character.service';
import { AuthService } from '../../auth/auth.service';
import { TurnService } from '../../services/turn.service';
import { TurnArrowComponent } from '../turn-arrow/turn-arrow.component';
import { GameFooterComponent } from '../game-footer-legacy/game-footer.component';
import { DeckName } from '../../types/card-deck';
import { MatDialog } from '@angular/material/dialog';
import {
  DiceRollDialogComponent,
  DiceRollDialogData,
} from '../dice-roll-dialog/dice-roll-dialog.component';
import { CharacterInfoComponent } from '../character-info/character-info.component';
import { EventMenuComponent } from '../event-menu/event-menu.component';
import { ItemMenuComponent } from '../item-menu/item-menu.component';
import { EventCardService } from '../../services/event-card.service';
import { WeaponCardService } from '../../services/weapon-card.service';
import { WeaponMenuComponent } from '../weapon-menu/weapon-menu.component';
import { ItemCardService } from '../../services/item-card.service';
import { LootService } from '../../services/loot.service';
import { CardRewardType } from '../../types/card-reward-type';
import { GoldMenuComponent } from '../gold-menu/gold-menu.component';
import { CharacterMenuComponent } from '../character-menu/character-menu.component';
import { ConfirmationMenuComponent } from '../confirmation-menu/confirmation-menu.component';
import { ZoomService } from '../../services/zoom.service';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { CombatService } from '../../services/combat.service';
import { Outcome } from '../../types/Outcome';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    PlayerComponent,
    MovementNodeComponent,
    CommonModule,
    TurnArrowComponent,
    GameFooterComponent,
    EventMenuComponent,
    CharacterInfoComponent,
    DiceRollDialogComponent,
    ItemMenuComponent,
    WeaponMenuComponent,
    GoldMenuComponent,
    CharacterMenuComponent,
    ConfirmationMenuComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [fadeIn, fadeOut],
})
export class GameComponent implements OnInit, OnDestroy {
  #combatService: CombatService = inject(CombatService);

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
  protected showWeaponCard = false;
  protected showItemCard = false;
  protected showGoldCard = false;
  protected showCharacterMenu = signal(false);
  protected goldFoundAmount: number = 0;

  protected showConfirmationMenu = false;
  protected confirmationMessage: string = '';
  protected confirmMenuCallback: () => void = () => {};

  protected cardName: string | undefined;
  protected deckName: DeckName | undefined;

  protected gameBoardScaleTestVar = '';

  protected zoomPercentageDisplay = 1;
  protected showZoomPercentage = false;
  private zoomDisplayTimeout: any;

  // LOOT SUBSCRIPTIONS
  protected drawWeaponSubscription =
    this.lootService.drawWeaponSubject.subscribe((lootType) =>
      this.drawWeaponCard(lootType)
    );
  protected drawItemSubscription = this.lootService.drawItemSubject.subscribe(
    (lootType) => this.drawItemCard(lootType)
  );
  protected drawGoldSubscription = this.lootService.drawGoldSubject.subscribe(
    (goldAmount) => this.drawGoldCard(goldAmount)
  );

  constructor(
    protected locationService: LocationService,
    private activatedRoute: ActivatedRoute,
    private gameSessionService: GameSessionService,
    private characterService: CharacterService,
    private authService: AuthService,
    private turnService: TurnService,
    public dialog: MatDialog,
    private eventCardService: EventCardService,
    private weaponCardService: WeaponCardService,
    private itemCardService: ItemCardService,
    private lootService: LootService,
    protected zoomService: ZoomService
  ) {
    const gameSessionID = this.activatedRoute.snapshot.params['gameSessionId'];

    this.gameSessionSub = this.gameSessionService
      .getGameSession(gameSessionID)
      .subscribe((gameSession) => {
        this.gameSession = gameSession;

        this.eventCardService.setCardDeckSubscriptions(this.gameSession.id);
        this.weaponCardService.setCardDeckSubscriptions(this.gameSession.id);
        this.itemCardService.setCardDeckSubscriptions(this.gameSession.id);

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
    this.drawWeaponSubscription.unsubscribe();
    this.drawItemSubscription.unsubscribe();
    this.drawGoldSubscription.unsubscribe();

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
      this.characterBeingControlledByClient,
      this.zoomPercentageDisplay
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
        this.characterBeingControlledByClient,
        this.zoomPercentageDisplay
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
        this.characterBeingControlledByClient,
        this.zoomPercentageDisplay
      );
      this.updateLocationNodeDataRelativeToPlayer();
    }
  }

  private async drawWeaponCard(lootType: CardRewardType): Promise<void> {
    if (!this.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw a weapon card without a character."
      );
    }

    const cardCriteria = {
      lootType: lootType,
    };

    this.cardName = await this.weaponCardService.drawCard(
      this.gameSession.id,
      cardCriteria
    );

    this.showWeaponCard = true;
  }

  private async drawGoldCard(goldAmount: number): Promise<void> {
    if (!this.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw an item card without a character."
      );
    }

    this.goldFoundAmount = goldAmount;
    this.showGoldCard = true;
  }

  // TODO Make a service to handle similar logic and extract it from the game component.
  protected addGoldToCharacter() {
    if (!this.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't add gold to a character without a character."
      );
    }

    this.characterBeingControlledByClient.gold += this.goldFoundAmount;
    this.characterService.updateCharacter(
      this.characterBeingControlledByClient,
      this.gameSession.id
    );

    this.goldFoundAmount = 0;
    this.showGoldCard = false;
  }

  protected addItemToPlayerInventory(): void {
    if (!this.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't add an item to a character without a character."
      );
    }

    if (!this.cardName) {
      throw new Error(
        "No card name. We can't add an item to a character without a card name."
      );
    }

    this.characterBeingControlledByClient.characterMenu.itemCards.push(
      this.cardName
    );
    this.characterService.updateCharacter(
      this.characterBeingControlledByClient,
      this.gameSession.id
    );

    this.showItemCard = false;
  }

  protected addWeaponToPlayerInventory(): void {
    if (!this.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't add a weapon to a character without a character."
      );
    }

    if (!this.cardName) {
      throw new Error(
        "No card name. We can't add a weapon to a character without a card name."
      );
    }

    const newEquipment: CharacterMenuEquipment = {
      cardName: this.cardName,
      equipped: false,
    };

    this.characterBeingControlledByClient.characterMenu.weaponCards.push(
      newEquipment
    );
    this.characterService.updateCharacter(
      this.characterBeingControlledByClient,
      this.gameSession.id
    );

    this.showWeaponCard = false;
  }

  private async drawItemCard(lootType?: CardRewardType): Promise<void> {
    if (!this.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw an item card without a character."
      );
    }

    const cardCriteria = {
      lootType: lootType,
    };

    this.cardName = await this.itemCardService.drawCard(
      this.gameSession.id,
      cardCriteria
    );

    this.showItemCard = true;
  }

  protected async drawEventCard(): Promise<void> {
    if (!this.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw an event card without a character."
      );
    }

    const cardCriteria = {
      locationType:
        this.characterBeingControlledByClient.currentLocation.locationType,
    };
    this.cardName = await this.eventCardService.drawCard(
      this.gameSession.id,
      cardCriteria
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

    // Find easy loot
    // TODO I can probably make this a map of keys and strings
    if (outcome == 9) {
      // this.drawWeaponCard();
      // TODO Add the loot service here
      this.lootService.drawLootCard('Easy');
    } else if (outcome == 13) {
      // Fight single bandit
      this.#combatService.startCombat();
    }
  }

  protected confirmEndMovement() {
    if (this.characterBeingControlledByClient!.movementSpeed ?? 0 > 0) {
      this.showConfirmationMenu = true;
      this.confirmationMessage = `You can still move ${
        this.characterBeingControlledByClient!.movementSpeed
      } spaces. Are you sure you want to stop moving?`;

      this.confirmMenuCallback = this.endMovementEarly;
    } else {
      this.rollForEventCard();
    }
  }

  private endMovementEarly() {
    this.characterBeingControlledByClient!.movementSpeed = 0;

    this.rollForEventCard();
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
      targetNumber: 6, // use 6 for testing
    };
    this.currentCharacterRollingDice = true;
  }

  protected toggleCharacterMenu(): void {
    // update the signal
    this.showCharacterMenu.set(!this.showCharacterMenu());
  }

  protected zoomIn(): void {
    if (this.zoomPercentageDisplay === 1) {
      return;
    }
    const newZoomValue = this.zoomService.zoomIn();
    this.onGrowGameBoard(newZoomValue);
    this.showZoomPercentageDisplay(newZoomValue);
  }

  protected zoomOut(): void {
    if (this.zoomPercentageDisplay <= 0.4) {
      return;
    }
    const newZoomValue = this.zoomService.zoomOut();
    this.onShrinkGameBoard(newZoomValue);
    this.showZoomPercentageDisplay(newZoomValue);
  }

  private showZoomPercentageDisplay(newZoomValue: number): void {
    clearTimeout(this.zoomDisplayTimeout);
    this.zoomPercentageDisplay = Math.round(newZoomValue * 10) / 10;
    this.showZoomPercentage = true;
    this.zoomDisplayTimeout = setTimeout(() => {
      this.showZoomPercentage = false;
    }, 1000);
  }

  protected onShrinkGameBoard(scalePercentage: number) {
    // Scale the game board down
    const gameBoard = document.getElementById('game-board');

    if (gameBoard) {
      gameBoard.style.transform = `scale(${scalePercentage})`;
      this.gameBoardScaleTestVar = gameBoard.style.transform;
    }
  }

  protected onGrowGameBoard(scalePercentage: number) {
    // Scale the game board up
    const gameBoard = document.getElementById('game-board');

    if (gameBoard) {
      gameBoard.style.transform = `scale(${scalePercentage})`;
      this.gameBoardScaleTestVar = gameBoard.style.transform;
    }
  }
}
