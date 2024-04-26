import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZoomService {
  private initialDistance: number = 0;

  private scalePercentage: number = 1; // The percentage of the scale in decimal form

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

      // Use the distance to calculate the amount we need to add to the style.transform.scale
      this.scalePercentage += (distance - this.initialDistance) / 1000;

      if (distance < this.initialDistance) {
        this.fingersTogether();
      } else if (distance > this.initialDistance) {
        this.fingersApart();
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
