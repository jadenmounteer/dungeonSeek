// Important to note: The card info is fetched from JSON
export type CardInfo = {
  name: string;
  description: string;
  quantity: number; // The number of times this card appears in the deck.
  discardAfterUse: boolean; // Whether or not to discard the card after use.
  choices: Choice[];
};

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
 * Here's how you add a new card deck:
 * 1. Add a new enum value to DeckName
 * 2. Add a new JSON file with the same DeckName
 * 3. Update the card.service.ts methods to account for this new deck name.
 */
export enum RoadEventCardNames {
  CRAZY_TRAVELER = 'Crazy Traveler',
  THE_LOST = 'The Lost',
  THE_BANDIT = 'The Bandit',
  THE_MERCHANT = 'The Merchant',
  THE_CARAVAN = 'The Caravan',
}

export enum CityEventCardNames {
  THE_MESSENGER = 'A Messenger',
  Rumors_OF_Giant_Raids_In_Mullin = 'Rumors of Giant Raids in Mullin',
  Pestered_By_Shopkeeper = 'Pestered by Shopkeeper',
}

// When adding a new deck, add a new JSON file with the same name
export enum DeckName {
  ROAD_EVENTS = 'Road Events',
  CITY_EVENTS = 'City Events',
}
