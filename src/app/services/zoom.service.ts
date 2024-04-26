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
  private readonly MIN_ZOOM: number = 0.2; // 50%

  // BehaviorSubjects for the gestures
  public moveFingersTogether = new BehaviorSubject<number>(0);
  public moveFingersApart = new BehaviorSubject<number>(0);

  // BehaviorSubjects for the gestures
  public zoomOutSubject = new BehaviorSubject<number>(0);
  public zoomInSubject = new BehaviorSubject<number>(0);

  constructor() {
    // Add event listeners for pinch gestures
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

      if (distance < this.initialDistance) {
        this.scalePercentage = this.zoomOut(0.06);
        this.fingersTogether();
      } else if (distance > this.initialDistance) {
        // Use the distance to calculate the amount we need to add to the style.transform.scale
        this.scalePercentage = this.zoomIn(0.06);
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

  public zoomIn(incrementPercentage: number = 0.3): number {
    // Zoom the screen in 15% increments
    const newZoomValue = this.scalePercentage + incrementPercentage;

    if (newZoomValue <= this.MAX_ZOOM) {
      this.scalePercentage += 0.1;
      this.scalePercentage = newZoomValue;
    }
    return this.scalePercentage;
  }

  public zoomOut(decrementPercentage: number = 0.3): number {
    // Zoom the screen out 10% increments
    const newZoomValue = this.scalePercentage - decrementPercentage;

    if (newZoomValue >= this.MIN_ZOOM) {
      this.scalePercentage -= 0.1;
      this.scalePercentage = newZoomValue;
    }
    return this.scalePercentage;
  }
}
