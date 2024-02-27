export interface Character {
  id: string;
  userId: string;
  name: string;
  class: CharacterClass;
  sex: 'Male' | 'Female';
  passAndPlay: boolean;
  level: number;
}

export type CharacterClass = 'Sorcerer';
