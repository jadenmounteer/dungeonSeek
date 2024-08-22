import { Injectable, OnDestroy, inject } from '@angular/core';
import { Outcome } from '../types/Outcome';
import { CombatService } from './combat.service';
import { LootService } from './loot.service';
import { GameStateService } from './game-state.service';
import { CharacterService } from './character/character.service';
import { GameDialogueData, GameDialogueService } from './game-dialogue.service';
import { CardRewardType } from '../types/card-reward-type';
import { Npc, NpcType } from '../types/npcs/npc';

@Injectable({
  providedIn: 'root',
})
export class OutcomeService implements OnDestroy {
  combatService: CombatService = inject(CombatService);
  #lootService: LootService = inject(LootService);
  #gameStateService: GameStateService = inject(GameStateService);
  #characterService: CharacterService = inject(CharacterService);
  #gameDialogueService: GameDialogueService = inject(GameDialogueService);

  // Strategy pattern map for mapping the outcome to the function that will handle the outcome.
  #outcomeStrategies = new Map<Outcome, () => void>([
    [
      Outcome.FIND_EASY_LOOT,
      () => this.#lootService.drawLootCard(CardRewardType.EASY),
    ],
    [
      Outcome.FIND_MODERATE_LOOT,
      () => this.#lootService.drawLootCard(CardRewardType.MODERATE),
    ],
    [
      Outcome.FIND_HARD_LOOT,
      () => this.#lootService.drawLootCard(CardRewardType.HARD),
    ],
    [
      Outcome.FIND_INSANE_LOOT,
      () => this.#lootService.drawLootCard(CardRewardType.INSANE),
    ],

    // TODO: Implement these outcomes
    // [Outcome.FIGHT_SINGLE_BANDIT, () => this.startCombat()],
    [Outcome.BANDIT_TAKES_YOUR_GOLD, () => this.#banditTakesYourGold()],
  ]);

  ngOnDestroy(): void {}

  private startCombat(npcInvolved: Npc): void {
    this.combatService.startCombatSession(npcInvolved);
  }

  public makeChoice(outcome: Outcome): void {
    const strategy = this.#outcomeStrategies.get(outcome);
    if (strategy) {
      strategy();
    } else {
      // Handle unknown outcome.
      console.error('No strategy found for outcome: ', outcome);
    }
  }

  async #banditTakesYourGold(): Promise<void> {
    if (!this.#gameStateService.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client.');
    }

    const gameDialogueData: GameDialogueData = {
      message: '',
      showButtonOne: true,
      showButtonTwo: false,
      buttonOneText: 'Close',
    };

    // Check if the player has any gold.
    if (this.#gameStateService.characterBeingControlledByClient.gold < 30) {
      // If the player has less than 30 gold, show a dialogue stating the bandit is angry with your lack of gold and attacks you.

      // Spawn the bandit npc
      const newNpc = await this.#gameStateService.spawnNpcRelativeToPlayer(
        NpcType.BANDIT,
        this.#gameStateService.characterBeingControlledByClient
      );

      this.#gameDialogueService.buttonOneCallback = this.startCombat.bind(
        this,
        newNpc
      );

      gameDialogueData.message = `"I changed my mind," the bandit says as he unsheathes his sword. "I'll take your gold and your life!"`;
      gameDialogueData.buttonOneText = 'Begin Combat';
      this.#gameDialogueService.showDialogue(gameDialogueData);
    } else {
      // If you have more than 30 gold, the bandit takes your gold and leaves you alone.
      this.#gameStateService.characterBeingControlledByClient.gold = 0;
      this.#characterService.updateCharacter(
        this.#gameStateService.characterBeingControlledByClient,
        this.#gameStateService.gameSession.id
      );

      // Show dialogue

      gameDialogueData.message =
        'The bandit smirks as you hand him all of your gold. He dashes off the road and you lose sight of him.';
      this.#gameDialogueService.showDialogue(gameDialogueData);

      this.#gameDialogueService.buttonOneCallback = () => {
        this.#gameDialogueService.closeDialogue.bind(this);
      };
    }
  }
}
