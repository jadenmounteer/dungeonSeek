import { Injectable } from '@angular/core';
import { Outcome } from '../types/Outcome';

@Injectable({
  providedIn: 'root',
})
export class OutcomeService {
  // Strategy pattern map for mapping the outcome to the function that will handle the outcome.
  #outcomeStrategies = new Map<Outcome, () => void>([
    [Outcome.FIND_EASY_LOOT, () => alert('found easy loot')],
    [Outcome.FIGHT_SINGLE_BANDIT, () => alert('Fight one bandit')],
  ]);

  constructor() {}

  public makeChoice(outcome: Outcome): void {
    // Convert the string to an int
    const outcomeToNumber = parseInt(outcome, 10);
    const strategy = this.#outcomeStrategies.get(outcome);
    if (strategy) {
      strategy();
    } else {
      // Handle unknown outcome.
      console.error('No strategy found for outcome: ', outcome);
    }
  }
}
