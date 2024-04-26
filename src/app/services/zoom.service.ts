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
  private readonly MIN_ZOOM: number = 0.4; // 40%

  // BehaviorSubjects for the gestures
  public moveFingersTogether = new BehaviorSubject<number>(0);
  public moveFingersApart = new BehaviorSubject<number>(0);

  constructor() {
    // Add event listeners
    document.addEventListener('touchstart', this.onTouchStart.bind(this));
    document.addEventListener('touchmove', this.onTouchMove.bind(this));
  }

  private onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      this.initialDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }

  private onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate the new scale percentage
      const newScalePercentage =
        this.scalePercentage + (distance - this.initialDistance) / 1000;

      // Check if the new scale percentage is within the allowed range
      if (
        newScalePercentage >= this.MIN_ZOOM &&
        newScalePercentage <= this.MAX_ZOOM
      ) {
        this.scalePercentage = newScalePercentage;

        if (distance < this.initialDistance) {
          this.fingersTogether();
        } else if (distance > this.initialDistance) {
          this.fingersApart();
        }
      }

      this.initialDistance = distance;
    }
  }

  private fingersTogether(): void {
    this.moveFingersTogether.next(this.scalePercentage);
  }

  private fingersApart(): void {
    this.moveFingersApart.next(this.scalePercentage);
  }
}
