import { Injectable } from '@angular/core';
import { Campaign } from '../../../types/campaign';

export enum CampaignNames {
  AGE_OF_THE_NECROMANCER = 'Age of the Necromancer',
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
