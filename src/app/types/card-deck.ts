// Important to note: The card info is fetched from JSON
export type Card = {
  name: CardName;
  description: string;
};

export interface CardDeck {
  id: string;
  deckName: DeckName;
  cardNames: CardName[];
}

export type CardName =
  | 'Crazy Traveler'
  | 'The Lost'
  | 'The Bandit'
  | 'The Merchant'
  | 'The Caravan';

// When adding a new deck, add a new JSON file with the same name
export enum DeckName {
  ROAD_EVENTS = 'Road Events',
  CITY_EVENTS = 'City Events',
}
