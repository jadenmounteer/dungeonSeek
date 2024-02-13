import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovementNodeService {
  constructor() {}

  public clickOnNode() {
    console.log('clickOnNode');
  }
}
