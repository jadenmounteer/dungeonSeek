import { Choice, CardCriteria } from './card-deck';

// Important to note: The card info is fetched from JSON
export type EventCardInfo = {
  name: string;
  description: string;
  quantity: number; // The number of times this card appears in the deck.
  discardAfterUse: boolean; // Whether or not to discard the card after use.
  choices: Choice[];
  cardCriteria: CardCriteria | null; // TODO this will be used to determine if the card can be drawn by the current player. For example, we don't want the orc trophy hunter card to be drawn by a low-level player.
  imgUrl: string;
};

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
