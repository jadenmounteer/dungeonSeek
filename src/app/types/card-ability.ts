// A card ability is the effect an action card has when played. Potions are used on yourself,
// while weapons are used on your opponent and spells can be used for both.

export interface CardAbility {
  name: ActionCardAbilityKey | PassiveCardAbilityKey;
  usedAgainstOpponentDescription: String;
  usedAgainstSelfDescription: String;
}

export type ActionCardAbilityKey = 'Fireball' | 'Heal' | 'Banish';

export const actionAbilitiesMap: { [key: string]: CardAbility } = {
  fireball: {
    name: 'Fireball',
    usedAgainstOpponentDescription: 'You throw a fireball at your opponent.',
    usedAgainstSelfDescription: 'You throw a fireball at yourself.',
  },
  heal: {
    name: 'Heal',
    usedAgainstOpponentDescription: 'You heal your opponent.',
    usedAgainstSelfDescription: 'You heal yourself.',
  },
  banish: {
    name: 'Banish',
    usedAgainstOpponentDescription:
      '50% chance to send your opponent to a distant location on the map on hit.',
    usedAgainstSelfDescription:
      '50% chance to send yourself to a distant location on the map.', // For example, the player could drink a banishment potion.
  },
};

export type PassiveCardAbilityKey =
  | 'Poison'
  | 'Regenerate'
  | 'Reflect'
  | 'Magika Regen';

export const passiveAbiliiesMap: { [key: string]: CardAbility } = {
  poison: {
    name: 'Poison',
    usedAgainstOpponentDescription: 'You poison your opponent.',
    usedAgainstSelfDescription: 'You poison yourself.',
  },
  regenerate: {
    name: 'Regenerate',
    usedAgainstOpponentDescription: 'You regenerate your opponent.',
    usedAgainstSelfDescription: 'You regenerate yourself.',
  },
  reflect: {
    name: 'Reflect',
    usedAgainstOpponentDescription: 'You reflect your opponent.',
    usedAgainstSelfDescription: 'You reflect yourself.',
  },
  magikaRegen: {
    name: 'Magika Regen',
    usedAgainstOpponentDescription: "You regenerate your opponent's magika.",
    usedAgainstSelfDescription: 'You regenerate your magika.',
  },
};
