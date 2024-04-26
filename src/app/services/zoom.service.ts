import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZoomService {
  private initialDistance: number = 0;

  private scalePercentage: number = 1; // The percentage of the scale in decimal form

  // Define the maximum and minimum zoom levels
  private readonly MAX_ZOOM: number = 2; // 200%
  private readonly MIN_ZOOM: number = 0.5; // 50%

  // BehaviorSubjects for the gestures
  public zoomOutSubject = new BehaviorSubject<number>(0);
  public zoomInSubject = new BehaviorSubject<number>(0);

  constructor() {}

  public zoomIn(): number {
    // Zoom the screen in 15% increments
    const newZoomValue = this.scalePercentage + 0.2;

    if (newZoomValue <= this.MAX_ZOOM) {
      this.scalePercentage += 0.1;
      this.scalePercentage = newZoomValue;
    }
    return this.scalePercentage;
  }

  public zoomOut(): number {
    // Zoom the screen out 10% increments
    const newZoomValue = this.scalePercentage - 0.2;

    if (newZoomValue >= this.MIN_ZOOM) {
      this.scalePercentage -= 0.1;
      this.scalePercentage = newZoomValue;
    }
    return this.scalePercentage;
  }
}
