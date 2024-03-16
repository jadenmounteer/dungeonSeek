// Important to note: The card info is fetched from JSON
export type CardInfo = {
  name: string;
  description: string;
  quantity: number; // The number of times this card appears in the deck.
  discardAfterUse: boolean; // Whether or not to discard the card after use.
};

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
  THE_MESSENGER = 'The Messenger',
}

// When adding a new deck, add a new JSON file with the same name
export enum DeckName {
  ROAD_EVENTS = 'Road Events',
  CITY_EVENTS = 'City Events',
}
