import { LocationType } from '../services/location-service';
import { Outcome } from './Outcome';
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
  NPCS = 'NPCs', // The NPCs for the base game
  // ARMOR = 'Armor',
}
