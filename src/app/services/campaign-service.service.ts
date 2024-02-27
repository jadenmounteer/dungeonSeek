import { Injectable } from '@angular/core';
import { Campaign } from '../types/campaign';

@Injectable({
  providedIn: 'root',
})
export class CampaignServiceService {
  constructor() {}

  public fetchCampaigns(): Campaign[] {
    const url: string = '../../../assets/data/campaigns.json';
    let campaigns: Campaign[] = [];
    fetch(url)
      .then((response: Response) => {
        let responseData;
        try {
          responseData = response.json();
        } catch (err) {
          console.error('Error fetching campaigns:', err);
        }
        return responseData;
      })
      .then((data: any[]) => {
        campaigns = data;
        console.log(campaigns);
      });
    return campaigns;
  }
}
