import { Injectable, OnDestroy, inject } from '@angular/core';
import { Outcome } from '../types/Outcome';
import { CombatService } from './combat.service';
import { LootService } from './loot.service';
import { GameStateService } from './game-state.service';
import { CharacterService } from './character/character.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OutcomeService implements OnDestroy {
  #combatService: CombatService = inject(CombatService);
  #lootService: LootService = inject(LootService);
  #gameStateService: GameStateService = inject(GameStateService);
  #characterService: CharacterService = inject(CharacterService);
  #activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  // Strategy pattern map for mapping the outcome to the function that will handle the outcome.
  #outcomeStrategies = new Map<Outcome, () => void>([
    [Outcome.FIND_EASY_LOOT, () => this.#lootService.drawLootCard('Easy')],
    [
      Outcome.FIND_MODERATE_LOOT,
      () => this.#lootService.drawLootCard('Moderate'),
    ],
    [Outcome.FIND_HARD_LOOT, () => this.#lootService.drawLootCard('Hard')],
    [Outcome.FIND_INSANE_LOOT, () => this.#lootService.drawLootCard('Insane')],
    [Outcome.FIGHT_SINGLE_BANDIT, () => this.#combatService.startCombat()],
    [Outcome.BANDIT_TAKES_YOUR_GOLD, () => this.#banditTakesYourGold()],
  ]);

  ngOnDestroy(): void {}

  public makeChoice(outcome: Outcome): void {
    const strategy = this.#outcomeStrategies.get(outcome);
    if (strategy) {
      strategy();
    } else {
      // Handle unknown outcome.
      console.error('No strategy found for outcome: ', outcome);
    }
  }

  #banditTakesYourGold(): void {
    if (!this.#gameStateService.characterBeingControlledByClient) {
      throw new Error('No character being controlled by client.');
    }

    // Check if the player has any gold.
    if (this.#gameStateService.characterBeingControlledByClient.gold < 30) {
      // If the player has less than 30 gold, show a dialogue stating the bandit is angry with your lack of gold and attacks you.
      // Initiate combat.
      this.#combatService.startCombat();
    } else {
      // If you have more than 30 gold, the bandit takes 30 gold and leaves you alone. Show a dialogue.

      // Show dialogue

      this.#gameStateService.characterBeingControlledByClient.gold = 0;
      this.#characterService.updateCharacter(
        this.#gameStateService.characterBeingControlledByClient,
        this.#gameStateService.gameSession.id
      );
    }
  }
}
