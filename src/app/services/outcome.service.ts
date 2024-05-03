import { Injectable, inject } from '@angular/core';
import { Outcome } from '../types/Outcome';
import { CombatService } from './combat.service';

@Injectable({
  providedIn: 'root',
})
export class OutcomeService {
  #combatService: CombatService = inject(CombatService);

  // Strategy pattern map for mapping the outcome to the function that will handle the outcome.
  #outcomeStrategies = new Map<Outcome, () => void>([
    [Outcome.FIND_EASY_LOOT, () => alert('found easy loot')],
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
