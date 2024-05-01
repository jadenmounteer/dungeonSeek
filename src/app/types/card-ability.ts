// A card ability is the effect an action card has when played. Potions are used on yourself,
// while weapons are used on your opponent and spells can be used for both.

export interface CardAbility {
  name: CardAbilityKey;
  usedAgainstOpponentDescription: String;
  usedAgainstSelfDescription: String;
}

export type CardAbilityKey =
  | 'Fireball'
  | 'Heal'
  | 'Banish'
  | 'Poison'
  | 'Regenerate'
  | 'Reflect'
  | 'Magika Regen'
  | 'Shrink'
  | 'Enlarge';

// Action card abilities are used by spells or scrolls
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
  shrink: {
    name: 'Shrink',
    usedAgainstOpponentDescription: 'You shrink your opponent.',
    usedAgainstSelfDescription: 'You shrink yourself.', // When something is shrunken I can make it appear smaller using CSS. Some stats are cut in half (health, stamina). However, the stealth is multiplied by 2.
  },
  enlarge: {
    name: 'Enlarge',
    usedAgainstOpponentDescription: 'You enlarge your opponent.',
    usedAgainstSelfDescription: 'You enlarge yourself.', // When something is enlarged I can make it appear larger using CSS. Some stats are doubled (health, stamina). However, stealth is divided by 2.
  },
};
