import { Choice, CardCriteria } from './card-deck';

// Important to note: The card info is fetched from JSON
export type EventCardInfo = {
  name: string;
  description: string;
  quantity: number; // The number of times this card appears in the deck.
  discardAfterUse: boolean; // Whether or not to discard the card after use.
  choices: Choice[];
  cardCriteria: CardCriteria | null; // TODO this will be used to determine if the card can be drawn by the current player. For example, we don't want the orc trophy hunter card to be drawn by a low-level player.
};
