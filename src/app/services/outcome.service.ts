import { Injectable, inject } from '@angular/core';
import { Outcome } from '../types/Outcome';
import { CombatService } from './combat.service';
import { LootService } from './loot.service';

@Injectable({
  providedIn: 'root',
})
export class OutcomeService {
  #combatService: CombatService = inject(CombatService);
  #lootService: LootService = inject(LootService);

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
  ]);

  constructor() {}

  public makeChoice(outcome: Outcome): void {
    const strategy = this.#outcomeStrategies.get(outcome);
    if (strategy) {
      strategy();
    } else {
      // Handle unknown outcome.
      console.error('No strategy found for outcome: ', outcome);
    }
  }
}
