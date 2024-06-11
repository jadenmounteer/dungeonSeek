import { Injectable } from '@angular/core';
import { Npc, NpcType } from '../types/npc';
import { LocationNode } from './location-service';
import { CardRewardType } from '../types/card-reward-type';
import { DeckName } from '../types/card-deck';

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
    'Ragnor',
    'Grubber',
    'Hank',
    'Hector',
    'Hugo',
  ];

  private maleGoblinNames = [
    'Gob',
    'Gobbo',
    'Gobbert',
    'Gobson',
    'Mongo',
    'Throg',
  ];

  private maleOrcNames = [
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
  ];

  private maleGiantNames = [
    'Gronk',
    'Grog',
    'Grug',
    'Mog',
    'Log',
    'Thog',
    'Throg',
    'Thrag',
    'Arg',
  ];

  private maleOgreNames = ['Nog', 'Melgash', 'Gorash', 'Eggash', 'Mogash'];

  private npcTypeToNameArray: Record<NpcType, string[]> = {
    [NpcType.BANDIT]: this.maleHumanNames,
    [NpcType.GOBLIN]: this.maleGoblinNames,
    [NpcType.ORC]: this.maleOrcNames,
    [NpcType.OGRE]: this.maleOgreNames,
    [NpcType.GIANT]: this.maleGiantNames,
  };

  constructor() {}

  public generateNewNpc(
    npcType: NpcType,
    location: LocationNode,
    difficulty: CardRewardType,
    directionFacing: 'Right' | 'Left' = 'Right',
    deckName: DeckName
  ): Npc {
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
      level: 1,
      inParty: false,
      directionFacing: directionFacing,
      rewardTypeForDefeatingNpc: difficulty,
    };

    return newNpc;
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
