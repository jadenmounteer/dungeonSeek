export enum ArmorClass {
  // Multiples of 6 because we use d6s for combat.
  // The more attack dice weapons and spells have, the more effective they are against your opponent.
  NONE = 1,
  LIGHT = 6,
  MEDIUM = 12,
  HEAVY = 18,
  IMPENETRABLE = 24,
}
