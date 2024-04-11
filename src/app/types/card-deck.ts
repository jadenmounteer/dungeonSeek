import { LocationType } from '../services/location-service';
import { CardRewardType } from './card-reward-type';

// The criteria needed to draw this card. If players do not meet this criteria the card is placed at the bottom of the deck.
// and another is drawn.
export interface CardCriteria {
  locationType?: LocationType;
  lootType?: CardRewardType;
  level?: number;
  gold?: number;
  items?: string[];
  questsCompleted?: string[];
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
  FIND_EASY_WEAPON = 5,
  FIND_MODERATE_WEAPON = 6,
  FIND_HARD_WEAPON = 7,
  FIND_INSANE_WEAPON = 8,
  FIND_EASY_LOOT = 9, // Could be any type of loot
  FIND_MODERATE_LOOT = 10, // Could be any type of loot
  FIND_HARD_LOOT = 11, // Could be any type of loot
  FIND_INSANE_LOOT = 12, // Could be any type of loot
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
 * 5. Add the deck to the card service so it can be fetched from the db.
 * 6. In the loadGameCards method in the game-session-lobby component, make sure to fetch the json info.
 * 7. Add the enum of this deck type to the createCardDeck method in the card service.
 *  **/
export enum DeckName {
  ROAD_EVENTS = 'Road Events',
  CITY_EVENTS = 'City Events',
  FOREST_EVENTS = 'Forest Events',
  WEAPONS = 'Weapons',
  ITEMS = 'Items',
  // ARMOR = 'Armor',
}
