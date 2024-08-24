// The outcome of the choice the player made.
// This will be output and a service will handle the outcome.
// We use strings because these values will come from the json
export enum Outcome {
  SUBTRACT_GOLD = '1',
  ADD_GOLD = '2',
  ADD_ITEM = '3',
  TRADE_WITH_MERCHANT = '4',
  FIND_EASY_WEAPON = '5',
  FIND_MODERATE_WEAPON = '6',
  FIND_HARD_WEAPON = '7',
  FIND_INSANE_WEAPON = '8',
  FIND_EASY_LOOT = '9', // Could be any type of loot
  FIND_MODERATE_LOOT = '10', // Could be any type of loot
  FIND_HARD_LOOT = '11', // Could be any type of loot
  FIND_INSANE_LOOT = '12', // Could be any type of loot
  FIGHT_SINGLE_BANDIT = '13',
  BANDIT_TAKES_YOUR_GOLD = '14',
  FIGHT_SINGLE_WOLF = '15',
  FIGHT_WOLF_PACK = '16',
  TWO_BANDITS_ATTACK = '17',
}
