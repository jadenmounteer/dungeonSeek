import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GestureService {
  @Output() moveFingersTogether = new EventEmitter<void>();
  @Output() moveFingersApart = new EventEmitter<void>();

  private initialDistance: number = 0;

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

      if (distance < this.initialDistance) {
        this.fingersTogether();
      } else if (distance > this.initialDistance) {
        this.fingersApart();
      }

      this.initialDistance = distance;
    }
  }

  private fingersTogether(): void {
    alert('Fingers together!');
    this.moveFingersTogether.emit();
  }

  private fingersApart(): void {
    alert('Fingers apart!');

    this.moveFingersApart.emit();
  }
}
