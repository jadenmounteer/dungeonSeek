import { Component, OnDestroy, inject, signal } from '@angular/core';
import { PlayerComponent } from '../characters/player/player.component';
import { MovementNodeComponent } from '../game/movement-node/movement-node.component';
import { LocationNode, LocationService } from '../../services/location-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameSessionService } from '../../services/game-session/game-session.service';
import { CharacterMenuEquipment } from '../../types/character';
import { CharacterService } from '../../services/character/character.service';
import { AuthService } from '../../auth/auth.service';
import { TurnService } from '../../services/turn.service';
import { TurnArrowComponent } from '../turn-arrow/turn-arrow.component';
import { GameFooterComponent } from '../game-footer-legacy/game-footer.component';
import { DeckName } from '../../types/card-deck';
import { DiceRollDialogComponent } from '../dice-roll-dialog/dice-roll-dialog.component';
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
import { ZoomService } from '../../services/zoom.service';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { CombatService } from '../../services/combat.service';
import { Outcome } from '../../types/Outcome';
import { OutcomeService } from '../../services/outcome.service';
import { GameStateService } from '../../services/game-state.service';
import { GameDialogueComponent } from '../game-dialogue/game-dialogue.component';
import {
  GameDialogueData,
  GameDialogueService,
} from '../../services/game-dialogue.service';
import { NpcService } from '../../services/npc.service';
import { NpcComponent } from '../npc/npc.component';
import { AttackMenuComponent } from '../attack-menu/attack-menu.component';
import { DiceRollDialogueService } from '../../services/dice-roll-dialogue.service';

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
    AttackMenuComponent,
    GameDialogueComponent,
    NpcComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [fadeIn, fadeOut],
})
export class GameComponent implements OnDestroy {
  public combatService: CombatService = inject(CombatService);
  public diceRollDialogueService: DiceRollDialogueService = inject(
    DiceRollDialogueService
  );
  #outcomeService: OutcomeService = inject(OutcomeService);
  #npcService: NpcService = inject(NpcService);

  public gameDialogueService: GameDialogueService = inject(GameDialogueService);

  public gameStateService: GameStateService = inject(GameStateService);

  private playerPositionSub: Subscription;

  private gameSessionSub: Subscription;

  protected charactersSub!: Subscription;
  public npcsSub!: Subscription;
  public combatSessionsSub!: Subscription;
  protected loading = true;
  protected locationsLoading = true;

  protected drawEventCardSub: Subscription =
    this.diceRollDialogueService.drawEventCardSub.subscribe(() => {
      this.drawEventCard();
    });

  protected waitingForNextTurnToStart = false;
  protected showEventCard = false;
  protected showWeaponCard = false;
  protected showItemCard = false;
  protected showGoldCard = false;
  protected showCharacterMenu = signal(false);
  public showAttackMenu = signal(false);
  protected goldFoundAmount: number = 0;

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
        this.gameStateService.gameSession = gameSession;

        this.eventCardService.setCardDeckSubscriptions(
          this.gameStateService.gameSession.id
        );
        this.weaponCardService.setCardDeckSubscriptions(
          this.gameStateService.gameSession.id
        );
        this.itemCardService.setCardDeckSubscriptions(
          this.gameStateService.gameSession.id
        );

        // If people were waiting for an online player to finish their turn
        // and they just finished their turn, start the next turn
        // We also check the characterIDsWhoHaveTakenTurn array because this gameSession subscription will
        // fire multiple times while we are waiting for other players
        if (
          this.waitingForNextTurnToStart &&
          this.gameStateService.gameSession.currentTurn
            .characterIDsWhoHaveTakenTurn.length === 0
        ) {
          this.waitingForNextTurnToStart = false;

          this.startNewCharacterTurn();
        }

        // TODO I can probable do this in a cleaner way with RXJS.
        // I know there's an operator where you can subscribe to multiple observables at once. SwitchMap would do the trick!
        if (!this.charactersSub) {
          this.setCharactersSub();
        }
        if (!this.npcsSub) {
          this.setNPCsSub();
        }

        if (!this.combatSessionsSub) {
          this.setCombatSessionsSub();
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
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw Error('No character being controlled by client');
    }

    let playersMovementSpeedValue =
      this.gameStateService.characterBeingControlledByClient.movementSpeed;

    let distanceFromCharacter = 1;
    let locationToCheck: LocationNode =
      this.gameStateService.characterBeingControlledByClient.currentLocation;

    this.locationService.setDistanceFromPlayerForAdjacentLocations(
      locationToCheck.adjacentLocations,
      distanceFromCharacter,
      playersMovementSpeedValue,
      this.gameStateService.characterBeingControlledByClient.currentLocation
    );

    this.locationsLoading = false;
  }

  async ngOnDestroy(): Promise<void> {
    this.playerPositionSub.unsubscribe();
    this.gameSessionSub.unsubscribe();
    this.charactersSub.unsubscribe();
    this.drawWeaponSubscription.unsubscribe();
    this.drawItemSubscription.unsubscribe();
    this.drawGoldSubscription.unsubscribe();
    this.npcsSub.unsubscribe();
    this.combatSessionsSub.unsubscribe();
    this.drawEventCardSub.unsubscribe();

    // If there are multiple players, signal to the server that the player is done with their turn
    if (this.gameStateService.gameSession.playerIDs.length > 1) {
      await this.currentCharacterFinishedTurn();
    }

    // Remove all of the player's characters from the game session for now
    // so the other players can take turns without needing to wait.
    await this.gameSessionService.temporarilyRemovePlayersAndCharactersFromGameSession(
      this.gameStateService.gameSession,
      this.gameStateService.charactersBeingControlledByClient
    );
  }

  private setCombatSessionsSub(): void {
    this.combatSessionsSub = this.combatService
      .getCombatSessionsInGameSession(this.gameStateService.gameSession.id)
      .subscribe((combatSessionsFromDB) => {
        this.gameStateService.createCombatSessionsMap(combatSessionsFromDB);
        if (this.gameStateService.playerBeingControlledByClientInCombat()) {
          this.gameStateService.refreshCurrentPlayerCombatSessionsState();
        }

        if (!this.gameStateService.npcCombatTurn) {
          const npcAttacking =
            this.gameStateService.refreshNPCsCombatSessionsState();

          if (npcAttacking) {
            this.combatService.takeNPCTurn(npcAttacking);
          }
        }
      });
  }

  private setNPCsSub(): void {
    this.npcsSub = this.#npcService
      .getNPCsInGameSession(this.gameStateService.gameSession.id)
      .subscribe((npcs) => {
        this.gameStateService.npcsInPlay = npcs;
        this.gameStateService.adjustLocationsWithPeopleOnThem();
      });
  }

  private setCharactersSub(): void {
    this.charactersSub = this.characterService
      .getCharactersInGameSession(this.gameStateService.gameSession.id)
      .subscribe((allCharactersInGameLobby) => {
        this.gameStateService.allCharactersCurrentlyInGameSession =
          this.gameSessionService.getCharactersInCurrentGameSession(
            allCharactersInGameLobby,
            this.gameStateService.gameSession
          );

        // TODO I probably don't need to do these things every time the characters change.
        // There probably a way to do this after the first time the characters are set.
        // I can probably use RXJS for this.
        // Or I can do something hacky and just check if the gameStateService.charactersBeingControlledByClient is empty.
        // If so, do this
        if (
          this.gameStateService.charactersBeingControlledByClient.length === 0
        ) {
          this.onEnterGame();
          this.loading = false;
        }
        this.gameStateService.adjustLocationsWithPeopleOnThem();
      });
  }

  private async moveCharacterToLocation(location: LocationNode): Promise<void> {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client');
    }

    if (
      this.gameStateService.characterBeingControlledByClient.movementSpeed === 0
    ) {
      return;
    }

    // If the location is not within reach, don't move the character
    if (location.distanceFromPlayer === null) {
      return;
    }

    if (
      location.distanceFromPlayer >
      this.gameStateService.characterBeingControlledByClient.movementSpeed
    ) {
      return;
    }

    this.changePlayerDirection(location);

    this.gameStateService.characterBeingControlledByClient.currentLocation.position =
      location.position;

    // I use the spread operator here so we don't store the actual location in the character object.
    // If we don't do this the character object will be storing the actual location object
    // and the character will bring the location with them. :)
    this.gameStateService.characterBeingControlledByClient.currentLocation = {
      ...location,
    };

    this.gameStateService.characterBeingControlledByClient.movementSpeed -=
      location.distanceFromPlayer ?? 1;

    // Update the character's location in the database
    this.gameStateService.characterBeingControlledByClient.position = {
      xPosition: location.position.xPosition,
      yPosition: location.position.yPosition,
    };

    const combatSessionID =
      this.gameStateService.checkIfPlayerLandedOnCombatSession(location.name);

    if (combatSessionID != null) {
      const combatSession =
        this.gameStateService.combatSessions.get(combatSessionID);
      this.gameStateService.characterBeingControlledByClient.combatSessionId =
        combatSessionID;
    }

    await this.characterService.updateCharacter(
      this.gameStateService.characterBeingControlledByClient,
      this.gameStateService.gameSession.id
    );

    this.updateLocationNodeDataRelativeToPlayer();
    this.gameSessionService.scrollToCharacterBeingControlledByClient(
      this.gameStateService.characterBeingControlledByClient,
      this.zoomPercentageDisplay
    );

    // TODO Loop through all of the characters and enemies on the game board
    // adjust the offsets accordingly.
    // I'll do this by storing a local map in the gameState service every location that has a player or NPC.
    // Then I'll loop through the map and adjust the offsets accordingly if there are multiple players or NPCs on the same location.
    this.gameStateService.adjustLocationsWithPeopleOnThem();
  }

  // TODO implement this method
  private changePlayerDirection(location: LocationNode) {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client');
    }
    if (
      this.gameStateService.characterBeingControlledByClient.currentLocation ===
      null
    ) {
      return;
    }
    if (
      location.position.xPosition <
      this.gameStateService.characterBeingControlledByClient.currentLocation
        .position.xPosition
    ) {
      this.gameStateService.characterBeingControlledByClient.directionFacing =
        'Left';
    } else {
      this.gameStateService.characterBeingControlledByClient.directionFacing =
        'Right';
    }
  }

  protected async currentCharacterFinishedTurn(): Promise<void> {
    this.diceRollDialogueService.currentCharacterRolledForEventCardThisTurn =
      false;

    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client');
    }

    await this.turnService.endCharacterTurn(
      this.gameStateService.gameSession,
      this.gameStateService.characterBeingControlledByClient.id
    );

    // If all the characters on client side have finished their turn, add the playerID to the array
    let playerIsFinished = true;
    this.gameStateService.charactersBeingControlledByClient.forEach(
      (character) => {
        if (
          !this.gameStateService.gameSession.currentTurn.characterIDsWhoHaveTakenTurn.includes(
            character.id
          )
        ) {
          playerIsFinished = false;
        }
      }
    );

    if (playerIsFinished) {
      this.gameStateService.characterBeingControlledByClient = undefined;
      await this.turnService.signalToServerThatPlayerIsDone(
        this.authService.activeUser!.uid,
        this.gameStateService.gameSession
      );

      if (
        this.turnService.allPlayersHaveFinishedTheirTurn(
          this.gameStateService.gameSession
        )
      ) {
        this.waitingForNextTurnToStart = true;

        this.#npcService.removeAllDeadNPCsFromGame(
          this.gameStateService.npcsInPlay,
          this.gameStateService.gameSession.id
        );

        await this.turnService.createNewTurn(
          this.gameStateService.gameSession,
          this.gameStateService.allCharactersCurrentlyInGameSession.map(
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

  private async onEnterGame() {
    await this.gameSessionService.addPlayersAndCharactersToGameSession(
      this.gameStateService.allCharactersCurrentlyInGameSession,
      this.gameStateService.gameSession
    );

    this.gameStateService.setCharactersBeingControlledByClient();

    // Since they just came back to the game session, clear their id from the array of characterIDsWhoHaveTakenTurn
    // So they can go again
    // TODO this does result in characters being able to take infinite turns if they keep refreshing the page.
    await this.turnService.clearClientCharacterIDsFromTurnArray(
      this.gameStateService.gameSession,
      this.characterService.getClientCharacters(
        this.gameStateService.allCharactersCurrentlyInGameSession,
        this.authService.activeUser?.uid
      )
    );

    await this.turnService.resetCharacterMovementSpeeds(
      this.gameStateService.charactersBeingControlledByClient,
      this.gameStateService.gameSession.id
    );

    this.gameStateService.determineWhosNextToBeControlledByClient(
      this.gameStateService.gameSession
    );

    if (this.gameStateService.characterBeingControlledByClient) {
      this.gameSessionService.scrollToCharacterBeingControlledByClient(
        this.gameStateService.characterBeingControlledByClient,
        this.zoomPercentageDisplay
      );
      this.updateLocationNodeDataRelativeToPlayer();
    }
  }

  private async startNewCharacterTurn() {
    // TODO I only need to reset the movement speed of the next player, not all of them.
    await this.turnService.resetCharacterMovementSpeeds(
      this.gameStateService.charactersBeingControlledByClient,
      this.gameStateService.gameSession.id
    );

    this.gameStateService.determineWhosNextToBeControlledByClient(
      this.gameStateService.gameSession
    );

    if (this.gameStateService.characterBeingControlledByClient) {
      this.gameSessionService.scrollToCharacterBeingControlledByClient(
        this.gameStateService.characterBeingControlledByClient,
        this.zoomPercentageDisplay
      );
      this.updateLocationNodeDataRelativeToPlayer();
    }
  }

  private async drawWeaponCard(lootType: CardRewardType): Promise<void> {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw a weapon card without a character."
      );
    }

    const cardCriteria = {
      lootType: lootType,
    };

    this.cardName = await this.weaponCardService.drawCard(
      this.gameStateService.gameSession.id,
      cardCriteria
    );

    this.showWeaponCard = true;
  }

  private async drawGoldCard(goldAmount: number): Promise<void> {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw an item card without a character."
      );
    }

    this.goldFoundAmount = goldAmount;
    this.showGoldCard = true;
  }

  // TODO Make a service to handle similar logic and extract it from the game component.
  protected addGoldToCharacter() {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't add gold to a character without a character."
      );
    }

    this.gameStateService.characterBeingControlledByClient.gold +=
      this.goldFoundAmount;
    this.characterService.updateCharacter(
      this.gameStateService.characterBeingControlledByClient,
      this.gameStateService.gameSession.id
    );

    this.goldFoundAmount = 0;
    this.showGoldCard = false;
  }

  protected addItemToPlayerInventory(): void {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't add an item to a character without a character."
      );
    }

    if (!this.cardName) {
      throw new Error(
        "No card name. We can't add an item to a character without a card name."
      );
    }

    this.gameStateService.characterBeingControlledByClient.characterMenu.itemCards.push(
      this.cardName
    );
    this.characterService.updateCharacter(
      this.gameStateService.characterBeingControlledByClient,
      this.gameStateService.gameSession.id
    );

    this.showItemCard = false;
  }

  protected addWeaponToPlayerInventory(): void {
    if (!this.gameStateService.characterBeingControlledByClient) {
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
    };

    this.gameStateService.characterBeingControlledByClient.characterMenu.weaponCards.push(
      newEquipment
    );
    this.characterService.updateCharacter(
      this.gameStateService.characterBeingControlledByClient,
      this.gameStateService.gameSession.id
    );

    this.showWeaponCard = false;
  }

  private async drawItemCard(lootType?: CardRewardType): Promise<void> {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw an item card without a character."
      );
    }

    const cardCriteria = {
      lootType: lootType,
    };

    this.cardName = await this.itemCardService.drawCard(
      this.gameStateService.gameSession.id,
      cardCriteria
    );

    this.showItemCard = true;
  }

  protected async drawEventCard(): Promise<void> {
    if (!this.gameStateService.characterBeingControlledByClient) {
      throw new Error(
        "No character being controlled by client. We can't draw an event card without a character."
      );
    }

    const cardCriteria = {
      locationType:
        this.gameStateService.characterBeingControlledByClient.currentLocation
          .locationType,
    };
    this.cardName = await this.eventCardService.drawCard(
      this.gameStateService.gameSession.id,
      cardCriteria
    );

    this.deckName =
      this.gameStateService.characterBeingControlledByClient?.currentLocation.eventDeckType;

    this.showEventCard = true;
  }

  protected closeCard() {
    this.showEventCard = false;
  }
  protected handleMakeChoice(outcome: Outcome) {
    this.showEventCard = false;

    this.#outcomeService.makeChoice(outcome);
  }

  protected confirmEndMovement() {
    if (
      this.gameStateService.characterBeingControlledByClient!.movementSpeed ??
      0 > 0
    ) {
      const gameDialogueData: GameDialogueData = {
        message: `You can still move ${
          this.gameStateService.characterBeingControlledByClient!.movementSpeed
        } spaces. Are you sure you want to stop moving?`,
        showButtonOne: true,
        showButtonTwo: true,
        buttonOneText: 'Yes',
        buttonTwoText: 'No',
      };

      this.gameDialogueService.buttonOneCallback =
        this.endMovementEarly.bind(this);

      this.gameDialogueService.buttonTwoCallback =
        this.gameDialogueService.closeDialogue.bind(this);

      this.gameDialogueService.showDialogue(gameDialogueData);
    } else {
      this.diceRollDialogueService.rollForEventCard();
    }
  }

  private endMovementEarly() {
    this.gameStateService.characterBeingControlledByClient!.movementSpeed = 0;

    this.diceRollDialogueService.rollForEventCard();
  }

  protected toggleCharacterMenu(): void {
    // update the signal
    this.showCharacterMenu.set(!this.showCharacterMenu());
  }

  protected toggleAttackMenu(): void {
    this.showAttackMenu.set(!this.showAttackMenu());
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
