// TODO implement this
export interface CardCriteria {
  level: number;
  gold: number;
  items: string[];
  questsCompleted: string[];
}

// The choices the player can make when drawing this card.
export interface Choice {
  description: string;
  outcome: Outcome;
}

// The outcome of the choice the player made.
// This will be output and a service will handle the outcome.
export enum Outcome {
  SUBTRACT_GOLD = 1,
  ADD_GOLD = 2,
  ADD_ITEM = 3,
  TRADE_WITH_MERCHANT = 4,
}

export interface CardDeck {
  id: string;
  deckName: string;
  cardNames: string[];
}

/**
 * When adding a new deck:
 * 1. Add a new JSON file with the same name
 * 2. Add the enum to this type
 * 3. Add the deck subscription to the card type component and add it to the setCardDeckSubscription method.
 * 4. Set the subscriptions in the game session component if necessary. See how we do it for event cards.
 *  **/
export enum DeckName {
  ROAD_EVENTS = 'Road Events',
  CITY_EVENTS = 'City Events',
  WEAPONS = 'Weapons',
}
