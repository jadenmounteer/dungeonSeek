import { Injectable } from '@angular/core';
import { Campaign } from '../../../types/campaign';

export enum CampaignNames {
  AGE_OF_THE_NECROMANCER = 'Age of the Necromancer',
  THE_LAND_OF_THE_DRAGON = 'The Land of the Dragon',
}
@Injectable({
  providedIn: 'root',
})
export class CampaignServiceService {
  constructor() {}

  // TODO in the future we can fetch campaign data from json files
  public async fetchCampaigns(): Promise<Response> {
    const url: string = 'assets/data/campaigns.json';

    return fetch(url);
  }
}
