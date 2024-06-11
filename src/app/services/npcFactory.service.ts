import { Injectable } from '@angular/core';
import { Npc, NpcType } from '../types/npc';
import { LocationNode } from './location-service';
import { CardRewardType } from '../types/card-reward-type';
import { DeckName } from '../types/card-deck';

export interface MinMax {
  min: number;
  max: number;
}

@Injectable({
  providedIn: 'root',
})
export class NpcFactory {
  private maleHumanNames = [
    'John',
    'Bob',
    'Billy',
    'Tom',
    'Tim',
    'Jim',
    'Joe',
    'Jack',
    'James',
    'Jake',
    'Hank',
    'Hector',
    'Hugo',
    'Homer',
    'Harry',
    'Henry',
    'Harold',
    'Harrison',
    'Frank',
    'Fred',
    'Finn',
    'Felix',
    'Floyd',
    'Fletcher',
    'Pete',
    'Paul',
    'Peter',
    'Zack',
    'Zane',
    'Zander',
    'Quinn',
    'Quincy',
    'Quentin',
    'Yuri',
    'Oscar',
    'Oliver',
    'Walter',
    'William',
    'Winston',
    'Victor',
    'Vincent',
    'Charles',
    'Christopher',
  ];

  private maleOrcishNames = [
    'Gor',
    'Gorbad',
    'Gorbag',
    'Gorblag',
    'Gorblad',
    'Gorblud',
    'Crusher',
    'Smasher',
    'Basher',
    'Slasher',
    'Killer',
    'Hunter',
    'Gob',
    'Gobbo',
    'Gobbert',
    'Gobson',
    'Mongo',
    'Throg',
    'Grubber',
  ];

  private maleGiantishNames = [
    'Gronk',
    'Grog',
    'Grug',
    'Mog',
    'Log',
    'Thog',
    'Throg',
    'Thrag',
    'Arg',
    'Nog',
    'Melgash',
    'Gorash',
    'Eggash',
    'Mogash',
    'Ragnor',
  ];

  private npcTypeToNameArray: Record<NpcType, string[]> = {
    [NpcType.BANDIT]: this.maleHumanNames,
    [NpcType.GOBLIN]: this.maleOrcishNames,
    [NpcType.ORC]: this.maleOrcishNames,
    [NpcType.OGRE]: this.maleGiantishNames,
    [NpcType.GIANT]: this.maleGiantishNames,
    [NpcType.ZOMBIE]: this.maleHumanNames,
    [NpcType.SKELETON]: this.maleHumanNames,
    [NpcType.VAMPIRE]: this.maleHumanNames,
    [NpcType.NECROMANCER]: this.maleHumanNames,
  };

  private npcDifficultyToLevel: Record<CardRewardType, MinMax> = {
    [CardRewardType.EASY]: { min: 1, max: 5 },
    [CardRewardType.MODERATE]: { min: 6, max: 11 },
    [CardRewardType.HARD]: { min: 11, max: 20 },
    [CardRewardType.INSANE]: { min: 20, max: 30 },
  };

  constructor() {}

  public generateNewNpc(
    npcType: NpcType,
    location: LocationNode,
    difficulty: CardRewardType,
    directionFacing: 'Right' | 'Left' = 'Right',
    deckName: DeckName
  ): Npc {
    const npcLevel = this.getNpcLevel(difficulty);

    const newNpc: Npc = {
      id: '',
      npcType: npcType,
      name: this.generateNewNpcName(npcType),
      deckName: deckName,
      npcStats: {
        health: {
          total: 100,
          current: 100,
        },
        mana: {
          total: 100,
          current: 100,
        },
        stamina: {
          total: 100,
          current: 100,
        },
      },
      currentLocation: location,
      position: location.position,
      level: npcLevel,
      inParty: false,
      directionFacing: directionFacing,
      rewardTypeForDefeatingNpc: difficulty,
    };

    return newNpc;
  }

  private getNpcLevel(difficulty: CardRewardType): number {
    const minMax = this.npcDifficultyToLevel[difficulty];
    if (!minMax) {
      throw new Error('Unknown difficulty: ' + difficulty);
    }
    return Math.floor(
      Math.random() * (minMax.max - minMax.min + 1) + minMax.min
    );
  }

  private generateNewNpcName(npcType: NpcType): string {
    const nameArray = this.npcTypeToNameArray[npcType];
    if (!nameArray) {
      throw new Error('Unknown npcType: ' + npcType);
    }
    return this.generateRandomName(nameArray) + npcType.toLocaleLowerCase();
  }

  private generateRandomName(names: string[]): string {
    const randomName = names[Math.floor(Math.random() * names.length)];
    return randomName + ' the ';
  }
}
