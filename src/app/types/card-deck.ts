// Important to note: The card info is fetched from JSON
export type CardInfo = {
  name: string;
  description: string;
};

export interface CardDeck {
  id: string;
  deckName: string;
  cardNames: string[];
}

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
