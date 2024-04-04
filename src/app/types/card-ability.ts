// A card ability is the effect an action card has when played. Potions are used on yourself,
// while weapons are used on your opponent and spells can be used for both.

export interface CardAbility {
  name: CardAbilityKey;
  usedAgainstOpponentDescription: String;
  usedAgainstSelfDescription: String;
}

export type CardAbilityKey = 'Fireball' | 'Heal' | 'Banish';

export const abilitiesMap: { [key: string]: CardAbility } = {
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
